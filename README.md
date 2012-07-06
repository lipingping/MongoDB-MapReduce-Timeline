MongoDB-MapReduce-Timeline
==========================

These are just some random tests I made a while ago with the help of MongoDB's MapReduce-framework.
It basically sorts out an interval-based timeline out of fake-stored videos (based on its object data), and returns aggregated information.

Nothing special really, this is just to benchmark its performance.

Conclusion:
Even when compiled with the V8 engine, the MongoDB MapReduce is generally -really slow-, and is definitely not suitable for real-time processing/aggregation (yet?).
