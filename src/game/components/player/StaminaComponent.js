define(['ash'], function (Ash) {
	var StaminaComponent = Ash.Class.extend({
		
		isPendingPenalty: false,
		
		constructor: function (initialStamina) {
			this.stamina = initialStamina;
			this.maxStamina = 1000;
			this.health = 1000;
			this.maxHP = this.health;
			this.hp = this.maxHP;
			this.accumulation = 0;
			this.accSources = [];
		},
		
		resetHP: function () {
			this.hp = this.maxHP;
		},

		getSaveKey: function () {
			return "Stamina";
		},
	});

	return StaminaComponent;
});
