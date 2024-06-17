package com.aem.ie.core.workflow;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Calendar;
import java.util.concurrent.atomic.AtomicInteger;

import javax.jcr.*;

import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.Replicator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.Workflow;
import com.adobe.granite.workflow.exec.WorkflowData;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.adobe.granite.workflow.metadata.SimpleMetaDataMap;
import com.day.cq.replication.ReplicationOptions;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class BulkReplicateModifiedAssetsProcessTest {

	AemContext aemContext = new AemContext();
	@Mock
	WorkItem item;
	@Mock
	WorkflowSession wfSession;
	@Mock
	MetaDataMap args;	
	@Mock
	ReplicationOptions opts;
	@Mock
	Workflow workflow;
	@Mock
	WorkflowData workflowData;
	@Mock
	Session session;
	@Mock
	Node folderNode;
	@Mock
	AtomicInteger foldersSeenCount;
	@Mock
	AtomicInteger assetsSeenCount;
	@Mock
	AtomicInteger assetsReplicatedCount;
	@Mock
	ChunkedReplicator chunked;
	@Mock
	NodeIterator iter;
	@Mock
	Node childNode;
	@Mock
	Object object;
	@InjectMocks
	BulkReplicateModifiedAssetsProcess bulkReplicateModifiedAssetsProcess;
	@Mock
	private Replicator replicator;

	@Mock
	private WorkItem workItem;

	@Mock
	private WorkflowSession workflowSession;

	@Mock
	private Node rootNode;

	@Mock
	private NodeIterator nodeIterator;

	@Mock
	private Node assetNode;

	@Mock
	private Property property;

	@Mock
	private PropertyIterator propertyIterator;

	@InjectMocks
	private BulkReplicateModifiedAssetsProcess workflowProcess;
	@BeforeEach
    void setUp() {
		MockitoAnnotations.openMocks(this);
	}
	@Test
    void testExecute() throws WorkflowException, PathNotFoundException, RepositoryException{
		
		WorkflowException exception = assertThrows(WorkflowException.class, () -> {
			 String path = "/content/dam/fm/Couplers.png";
				when(item.getWorkflow()).thenReturn(workflow);
				when(workflow.getWorkflowData()).thenReturn(workflowData);
				 when(workflowData.getPayloadType()).thenReturn("JCR_PATH");
			        MetaDataMap metaData = new SimpleMetaDataMap();
			        metaData.put("PROCESS_ARGS", "");
		        when(workflowData.getPayload()).thenReturn("exception");
		        when(wfSession.adaptTo(Session.class)).thenReturn(session);
		        when(workflow.getId()).thenReturn("replicator");
				bulkReplicateModifiedAssetsProcess.execute(item, wfSession, args);
	        });
		}

	@Test
	void testWalkTree() throws RepositoryException, ReplicationException, ReplicationException {
		AtomicInteger foldersSeenCount = new AtomicInteger(0);
		AtomicInteger assetsSeenCount = new AtomicInteger(0);
		AtomicInteger assetsReplicatedCount = new AtomicInteger(0);

		when(nodeIterator.hasNext()).thenReturn(true, true, false);
		when(nodeIterator.nextNode()).thenReturn(assetNode);

		when(assetNode.isNodeType("dam:Asset")).thenReturn(true);
		when(assetNode.hasProperty("jcr:content/cq:lastReplicated")).thenReturn(true);
		when(assetNode.getProperty("jcr:content/cq:lastReplicated")).thenReturn(property);
		when(assetNode.getProperty("jcr:content/cq:lastReplicated").getDate()).thenReturn(Calendar.getInstance());

		when(assetNode.hasProperty("jcr:content/jcr:lastModified")).thenReturn(true);
		when(assetNode.getProperty("jcr:content/jcr:lastModified")).thenReturn(property);
		when(assetNode.getProperty("jcr:content/jcr:lastModified").getDate()).thenReturn(Calendar.getInstance());
		when(rootNode.getNodes()).thenReturn(nodeIterator);

		ChunkedReplicator chunked = mock(ChunkedReplicator.class);
		workflowProcess.walkTree(rootNode, foldersSeenCount, assetsSeenCount, assetsReplicatedCount, chunked);

		// Add your assertions here based on the behavior of the walkTree() method.
	}

	@Test
	void testNeedsReplicating() throws RepositoryException {
		Calendar calendar=mock(Calendar.class);
		when(assetNode.hasProperty("jcr:content/cq:lastReplicated")).thenReturn(false);
		assertTrue(workflowProcess.needsReplicating(assetNode));

		when(assetNode.hasProperty("jcr:content/cq:lastReplicated")).thenReturn(true);
		when(assetNode.getProperty("jcr:content/cq:lastReplicated")).thenReturn(property);
		when(assetNode.getProperty("jcr:content/cq:lastReplicated").getDate()).thenReturn(Calendar.getInstance());
		when(assetNode.hasProperty("jcr:content/jcr:lastModified")).thenReturn(true);
		when(assetNode.getProperty("jcr:content/jcr:lastModified")).thenReturn(property);
		when(assetNode.getProperty("jcr:content/jcr:lastModified").getDate()).thenReturn(Calendar.getInstance());
		assertFalse(workflowProcess.needsReplicating(assetNode));

		when(assetNode.getProperty("jcr:content/cq:lastReplicated").getDate()).thenReturn(Calendar.getInstance());
		when(assetNode.getProperty("jcr:content/jcr:lastModified").getDate()).thenReturn(Calendar.getInstance());
		assertFalse(workflowProcess.needsReplicating(assetNode));
	}

	@Test
	void testIsAsset() throws RepositoryException {
		when(assetNode.isNodeType("dam:Asset")).thenReturn(true);
		assertTrue(workflowProcess.isAsset(assetNode));

		when(assetNode.isNodeType("dam:Asset")).thenReturn(false);
		assertFalse(workflowProcess.isAsset(assetNode));
	}

	@Test
	void testIsFolder() throws RepositoryException {
		when(assetNode.isNodeType("nt:folder")).thenReturn(true);
		assertTrue(workflowProcess.isFolder(assetNode));

		when(assetNode.isNodeType("nt:folder")).thenReturn(false);
		assertFalse(workflowProcess.isFolder(assetNode));
	}

	@Test
	void testGetPayloadPath() {
		WorkflowData workflowData = mock(WorkflowData.class);
		when(workItem.getWorkflow()).thenReturn(workflow);
		when(workflow.getWorkflowData()).thenReturn(workflowData);
		when(workflowData.getPayloadType()).thenReturn("JCR_PATH");
		when(workflowData.getPayload()).thenReturn("/content/dam");

		String payloadPath = workflowProcess.getPayloadPath(workItem);
		assertEquals("/content/dam", payloadPath);

		// Test when payloadType is not "JCR_PATH"
		when(workflowData.getPayloadType()).thenReturn("SOME_OTHER_TYPE");
		assertNull(workflowProcess.getPayloadPath(workItem));
	}
}

