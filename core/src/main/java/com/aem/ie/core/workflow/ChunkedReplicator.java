package com.aem.ie.core.workflow;

import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.ReplicationOptions;
import com.day.cq.replication.Replicator;

import org.apache.commons.lang3.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;

import java.util.ArrayList;
import java.util.List;

/**
 * A wrapper class around a replicator which perform chunked replication; it
 * collects a number of paths up to a certain threshold and then issues a single
 * call of the replicator to send them all at once.
 *
 */

public class ChunkedReplicator implements AutoCloseable {

	private static final Logger LOG = LoggerFactory.getLogger(ChunkedReplicator.class);

	Replicator replicator;
	int chunkSize;
	Session replicationSession;
	ReplicationOptions options;
	private String chunkReplicatorId;

	List<String> paths;

	int totalPathsSubmitted = 0;
	StopWatch watch = new StopWatch();

	/**
	 * Wrapper class around a replicator to allow chunked replication
	 * 
	 * @param session    the session to use for replication
	 * @param replicator the replicator to use
	 * @param opts       the options used the replication of every chunk
	 * @param chunkSize  the chunksize
	 * @param id         an identifier which is used for logging purposes
	 */
	public ChunkedReplicator(Session session, Replicator replicator, ReplicationOptions opts, int chunkSize,
			String id) {
		this.replicationSession = session;
		this.replicator = replicator;
		this.options = opts;
		this.chunkSize = chunkSize;
		this.chunkReplicatorId = "chunkedReplication-" + id;
		paths = new ArrayList<>(chunkSize);
		watch.start();

	}

	/**
	 * Add a path to the ChunkedReplicator; if the threshold is passed, all paths
	 * accumulated up till now are replicated in a single call.
	 * 
	 * @param path the path to replicate
	 * @throws ReplicationException
	 * @return true if this submission triggered a replication, false if this
	 *         submission is just queued (for later replication)
	 */
	public boolean submitPath(String path) throws ReplicationException {
		paths.add(path);
		LOG.trace("submitting {} to {}", path, chunkReplicatorId);
		totalPathsSubmitted++;
		if (paths.size() == chunkSize) {
			runReplication();
			return true;
		}
		return false;
	}

	/**
	 * When done, replicate all remaining paths.
	 */
	public void close() throws ReplicationException {
		runReplication();
		watch.stop();
		LOG.info("closing {}, {} paths replicated in {} ms",
				new Object[] { chunkReplicatorId, totalPathsSubmitted, watch.getTime() });
	}

	void runReplication() throws ReplicationException {
		if (paths.size() > 0) {
			String[] pathsArray = paths.toArray(new String[0]);
			replicate(pathsArray);
			paths.clear();
		}
	}

	/* Extracted to ease testing */
	void replicate(String[] paths) throws ReplicationException {
		replicator.replicate(replicationSession, ReplicationActionType.ACTIVATE, paths, options);
	}

	/**
	 * return the total number of paths already submitted to this ChunkReplicator;
	 * it might also include non-yet replicated paths.
	 * 
	 * @return the number of already submitted paths
	 */
	public int getReplicatedPaths() {
		return totalPathsSubmitted;
	}

}