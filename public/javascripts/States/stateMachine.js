class StateMachine	{
	constructor (starting, states) {
		// states is an array of classes with the following properties:
		// 		name: string
		// 		onEnter: method
		// 		onExit: method
		// 		onUpdate: method
		// 		transitions: array of objects with the following properties:
		// 			name: string
		// 			action: method
		this.states = states
		this.currentState = this.states.find(state => state.name == stateName)
		this.previousState = null
		this.transitions = []

	}

	setState(stateName) {
		transition = this.currentState.transitions.find(transition => transition.to == stateName)
		if (transition) {
			this.nextState = this.states.find(state => state.name == stateName)
			if (this.currentState != this.nextState) {
				this.currentState.onExit() 
				transition.action()
				this.nextState.onEnter()
				this.previousState = this.currentState
				this.currentState = this.nextState
			}
		}
	}

	update() {
		this.currentState.onUpdate()
	}
}