package com.aem.ie.core.workflow;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowData;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.ReplicationOptions;
import com.day.cq.replication.Replicator;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Calendar;
import java.util.concurrent.atomic.AtomicInteger;

import static com.day.cq.commons.jcr.JcrConstants.NT_FOLDER;
import static com.day.cq.dam.api.DamConstants.NT_DAM_ASSET;

@Component(service = WorkflowProcess.class, property = { "process.label=IE Bulk Publishing Process" })
public class BulkReplicateModifiedAssetsProcess implements WorkflowProcess {
	private static final Logger LOG = LoggerFactory.getLogger(BulkReplicateModifiedAssetsProcess.class);

	@Reference
	private Replicator replicator;

	@Override
	public void execute(WorkItem item, WorkflowSession wfSession, MetaDataMap args) throws WorkflowException {

		ReplicationOptions opts = new ReplicationOptions();

		String rootPath = getPayloadPath(item);
		Session session = wfSession.adaptTo(Session.class);

		AtomicInteger assetsSeenCount = new AtomicInteger(0);
		AtomicInteger assetsReplicatedCount = new AtomicInteger(0);
		AtomicInteger foldersSeenCount = new AtomicInteger(0);

		try (ChunkedReplicator chunked = new ChunkedReplicator(session, replicator, opts, 500,
				item.getWorkflow().getId() + "-replicator")) {

			if (session.nodeExists(rootPath)) {
				walkTree(session.getNode(rootPath), foldersSeenCount, assetsSeenCount, assetsReplicatedCount, chunked);
			} else {
				throw new WorkflowException("Error walking tree: folder '" + rootPath + "' did not exist");
			}

		} catch (RepositoryException | ReplicationException e) {
			throw new WorkflowException("Error walking tree: " + e.getMessage(), e);
		}

	}

	protected void walkTree(Node folderNode, AtomicInteger foldersSeenCount, AtomicInteger assetsSeenCount,
			AtomicInteger assetsReplicatedCount, ChunkedReplicator chunked)
			throws RepositoryException, ReplicationException {
		NodeIterator iter = folderNode.getNodes();
		while (iter.hasNext()) {

			Node childNode = iter.nextNode();

			if (isAsset(childNode)) {
				long assetsSeen = assetsSeenCount.incrementAndGet();

				if (needsReplicating(childNode)) {
					chunked.submitPath(childNode.getPath());
					long assetsReplicated = assetsReplicatedCount.incrementAndGet();
					if (assetsReplicated % 100 == 0) {
						LOG.info("walkTree: Replicated {} assets ({})", assetsReplicated, assetsSeen);
					}
				}

				if (assetsSeen % 100 == 0) {
					LOG.info("walkTree: Seen {} assets", assetsSeen);
				}
			} else if (isFolder(childNode)) {
				foldersSeenCount.incrementAndGet();
				walkTree(childNode, foldersSeenCount, assetsSeenCount, assetsReplicatedCount, chunked);
			}
		}
		LOG.info("walkTree: Finished replicating contents of folder {} ({})", folderNode.getPath(),
				foldersSeenCount.get());
	}

	/*
	 * Answer true if the Asset represented by the passed Node is - - unreplicated -
	 * modified since last replication
	 */
	protected boolean needsReplicating(Node assetNode) throws RepositoryException {
		if (!assetNode.hasProperty("jcr:content/cq:lastReplicated")) {
			return true;
		} else {
			Calendar lastReplicatedDate = assetNode.getProperty("jcr:content/cq:lastReplicated").getDate();
			if (assetNode.hasProperty("jcr:content/jcr:lastModified")) {
				Calendar lastModifiedDate = assetNode.getProperty("jcr:content/jcr:lastModified").getDate();
				if (lastReplicatedDate.before(lastModifiedDate)) {
					return true;
				}
			}
		}
		return false;
	}

	protected boolean isAsset(Node node) throws RepositoryException {
		return node.isNodeType(NT_DAM_ASSET);
	}

	protected boolean isFolder(Node node) throws RepositoryException {
		return node.isNodeType(NT_FOLDER);
	}

	protected String getPayloadPath(WorkItem workItem) {
		WorkflowData workflowData = workItem.getWorkflow().getWorkflowData();
		if ("JCR_PATH".equals(workflowData.getPayloadType())) {
			return (String) workflowData.getPayload();
		} else {
			return null;
		}
	}
}
