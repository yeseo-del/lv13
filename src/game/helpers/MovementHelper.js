// Singleton with helper methods for movement, blockers etc
define([
    'ash',
    'game/constants/ItemConstants',
    'game/constants/LocaleConstants',
    'game/constants/PositionConstants',
    'game/nodes/player/ItemsNode',
    'game/components/common/PositionComponent',
    'game/components/sector/PassagesComponent',
    'game/components/sector/SectorControlComponent',
    'game/components/sector/improvements/SectorImprovementsComponent',
], function (Ash, ItemConstants, LocaleConstants, PositionConstants, ItemsNode, PositionComponent, PassagesComponent, SectorControlComponent, SectorImprovementsComponent) {
    
    var MovementHelper = Ash.Class.extend({
        
		engine: null,
		itemsNodes: null,
		
		constructor: function (engine) {
			this.engine = engine;
			this.itemsNodes = engine.getNodeList(ItemsNode);
		},
		
		getBlocker: function (sectorEntity, direction) {
			var passagesComponent = sectorEntity.get(PassagesComponent);
			return passagesComponent.getBlocker(direction);
		},
		
		isBlocked: function (sectorEntity, direction) {
			return this.isBlockedCheck(sectorEntity, direction).value;
		},
		
		getBlockedReason: function (sectorEntity, direction) {
			return this.isBlockedCheck(sectorEntity, direction).reason;
		},
		
		isBlockedCheck: function (sectorEntity, direction) {
			var passagesComponent = sectorEntity.get(PassagesComponent);
			
			var reason = "";
			var blocked = true;
			
			if (PositionConstants.isLevelDirection(direction)) {
				var isBridged = this.isBridged(sectorEntity, direction);
				var isDefeated = this.isDefeated(sectorEntity, direction);
				var isCleaned = false;
				
				var blocker = passagesComponent.getBlocker(direction);
					
				var notBridged = blocker != null && blocker.bridgeable && !isBridged;
				var notBridged = blocker != null && blocker.bridgeable && !isBridged;
				var notDefeated = blocker != null && blocker.defeatable && !isDefeated;
				var notCleaned = blocker != null && blocker.cleanable && !isCleaned;
				
				blocked = Boolean(blocker && (notBridged || notDefeated || notCleaned));
				if (notBridged) reason = "Bridge needed.";
				if (notDefeated) reason = "Blocked by a gang.";
				if (notCleaned) reason = "Blocked by toxic waste.";
				
				return { value: blocked, reason: reason };
			}
			
			if (direction === PositionConstants.DIRECTION_UP || direction === PositionConstants.DIRECTION_DOWN) {
				var items = this.itemsNodes.head.items.getEquipped(ItemConstants.itemTypes.movement);
				var isFlying = false;
				
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if (item.id === ItemConstants.itemDefinitions.movement[0].id) isFlying = true;
				}
				
				blocked = true;
				var passage = null;
				if (direction === this.DIRECTION_UP) passage = passagesComponent.passageUp;
				if (direction === this.DIRECTION_DOWN) passage = passagesComponent.passageDown;
				
				if (!passage) {
					blocked = true;
					reason = "No passage.";
				} else {
					blocked = false;
				}
			}
			
			return { value: blocked, reason: reason };
		},
		
		isBridged: function (sectorEntity, direction) {
			var improvementsComponent = sectorEntity.get(SectorImprovementsComponent);
			return this.hasBridgeableBlocker(sectorEntity, direction) && improvementsComponent.getCount(improvementNames.bridge) > 0;
		},
		
		isDefeated: function (sectorEntity, direction) {
			var controlComponent = sectorEntity.get(SectorControlComponent);
			var localeId = LocaleConstants.getPassageLocaleId(direction);
			return this.hasDefeatableBlocker(sectorEntity, direction) && controlComponent.hasControlOfLocale(localeId);
		},
		
		hasBridgeableBlocker: function (sectorEntity, direction) {
			var passagesComponent = sectorEntity.get(PassagesComponent);
			return passagesComponent.isBridgeable(direction);
		},
		
		hasDefeatableBlocker: function (sectorEntity, direction) {
			var passagesComponent = sectorEntity.get(PassagesComponent);
			return passagesComponent.isDefeatable(direction);
		},
    });
    
    return MovementHelper;
});