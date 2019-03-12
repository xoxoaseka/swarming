# Swarming experiments

Web-based interactive model of virtual swarms to get a sense of this collective behavior. Model simulates individual agents, which follow simple rules:
- Move in the same direction as their neighbours
- Remain close to their neighbours
- Avoid collisions with their neighbours

How do we define zones of alignment, attraction, and repulsion? 
Birds: interactions between flocking starlings are based on a topological, rather than a metric, rule.
Ants: each ant is an autonomous unit that reacts depending only on its local environment and the genetically encoded rules for its variety.


Based on the flocking exmaple from the NoC Chapter 6, following experiments have been created:
Goal: Observe how agents respond to random perturbations by adopting at each time increment the average direction of motion of the other particles in their local neighbourhood.

## Observing behaviour
![](media/normal.gif)
![](media/normal2.gif)
## Swarm Brush:
![](media/force.gif)
![](media/speed.gif)

Next steps:
Simulation: 
- Negotiate the bottleneck
- Predetermined direction (from A to B)
- Reinforcement learning implementation to see if agents can figure out their own rules, if it’s self-optimizing, adapting:
limited amount of time to cross, weighted rules
- Experiment with thresholds
Lookup: Stochastic learning automata
