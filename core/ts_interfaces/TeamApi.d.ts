import * as Resources from '../api/external/Resources'

export default class TeamApi {
    units = {
        peasant: Peasant,
        warrior: Warrior
    }

    getResources(): Resources;

    getPopulation(): int;

    getResourcePoints(): IResourceSource[];

    getBuildings(): { townHall: TownHall[], all: IBuilding[] };

    getEnemyBuildings(): { townHall: TownHall[], all: IBuilding[] };

    getUnits(): { peasant: Peasant[], warrior: Warrior[], all: IMovable[] };

    getEnemyUnits(): { peasant: Peasant[], warrior: Warrior[], all: IMovable[] };

    getMap(): Map<int, Map<int, IEntity>>;

    get team(): int;

    get maximumPopulation(): int;

    get actions(): ActionsBuilder;

    get production(): { peasant: int, warrior: int };

}