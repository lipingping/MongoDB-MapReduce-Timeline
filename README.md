MongoDB-MapReduce-Timeline
==========================

MongoDB MapReduce-Timeline TestThese are just some random tests I made before with MongoDB's MapReduce-framework.
It basically sorts out a interval-based timeline out of (fake/test-stored) "videos and/or images", based on its object data, and returns aggregated information.

Nothing special, really, just to benchmark its performance.
Conclusion? Even when compiled with the V8 engine, the MongoDB MapReduce is generally -slow-, and is definitely not suitable for real-time processing/aggregation.
