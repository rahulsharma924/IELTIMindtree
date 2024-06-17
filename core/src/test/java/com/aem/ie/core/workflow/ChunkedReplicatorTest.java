package com.aem.ie.core.workflow;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.ReplicationOptions;
import com.day.cq.replication.Replicator;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import com.day.cq.replication.ReplicationActionType;
import org.slf4j.Logger;

import javax.jcr.Session;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ChunkedReplicatorTest {

    @Mock
    private Replicator replicator;

    @Mock
    private Session session;

    @Mock
    private ReplicationOptions options;
    private ChunkedReplicator chunkedReplicator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        chunkedReplicator = new ChunkedReplicator(session, replicator, options, 2, "test-id");
    }

    @Test
    void testSubmitPath() throws ReplicationException {
        String path1 = "/content/dam/image1.jpg";
        String path2 = "/content/dam/image2.jpg";
        String path3 = "/content/dam/image3.jpg";

        // Submit paths and verify replication is not triggered until chunkSize is reached
        assertFalse(chunkedReplicator.submitPath(path1));
        assertTrue(chunkedReplicator.submitPath(path2));

        // On the third submission, replication should be triggered
        assertFalse(chunkedReplicator.submitPath(path3));

        // Verify that replicator.replicate() is called with the correct paths
        verify(replicator).replicate(eq(session), eq(ReplicationActionType.ACTIVATE), eq(new String[]{path1, path2}), eq(options));
       }

    @Test
    void testClose() throws ReplicationException {
        String path1 = "/content/dam/image1.jpg";
        String path2 = "/content/dam/image2.jpg";

        chunkedReplicator.submitPath(path1);
        chunkedReplicator.submitPath(path2);

        chunkedReplicator.close();

        // Verify that replicator.replicate() is called with the remaining paths
        verify(replicator).replicate(eq(session), eq(ReplicationActionType.ACTIVATE), eq(new String[]{path1, path2}), eq(options));

        // Verify that paths list is cleared after close()
        assertEquals(0, chunkedReplicator.paths.size());
    }

    @Test
    void testGetReplicatedPaths() throws ReplicationException {
        String path1 = "/content/dam/image1.jpg";
        String path2 = "/content/dam/image2.jpg";
        String path3 = "/content/dam/image3.jpg";

        chunkedReplicator.submitPath(path1);
        chunkedReplicator.submitPath(path2);

        // On calling getReplicatedPaths(), it should return the total number of submitted paths
        assertEquals(2, chunkedReplicator.getReplicatedPaths());

        chunkedReplicator.submitPath(path3);

        // After another submission, the total number of submitted paths should be 3
        assertEquals(3, chunkedReplicator.getReplicatedPaths());
    }
}
