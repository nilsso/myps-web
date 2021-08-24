const logicTypes = [
    'None', 'Power', 'Open', 'Mode', 'Error', 'Pressure', 'Temperature', 'PressureExternal',
    'PressureInternal', 'Activate', 'Lock', 'Charge', 'Setting', 'Reagents', 'RatioOxygen',
    'RatioCarbonDioxide', 'RatioNitrogen', 'RatioPollutant', 'RatioVolatiles', 'RatioWater',
    'Horizontal', 'Vertical', 'SolarAngle', 'Maximum', 'Ratio', 'PowerPotential', 'PowerActual',
    'Quantity', 'On', 'ImportQuantity', 'ImportSlotOccupant', 'ExportQuantity',
    'ExportSlotOccupant', 'RequiredPower', 'HorizontalRatio', 'VerticalRatio', 'PowerRequired',
    'Idle', 'Color', 'ElevatorSpeed', 'ElevatorLevel', 'RecipeHash', 'ExportSlotHash',
    'ImportSlotHash', 'PlantHealth1', 'PlantHealth2', 'PlantHealth3', 'PlantHealth4',
    'PlantGrowth1', 'PlantGrowth2', 'PlantGrowth3', 'PlantGrowth4', 'PlantEfficiency1',
    'PlantEfficiency2', 'PlantEfficiency3', 'PlantEfficiency4', 'PlantHash1', 'PlantHash2',
    'PlantHash3', 'PlantHash4', 'RequestHash', 'CompletionRatio', 'ClearMemory', 'ExportCount',
    'ImportCount', 'PowerGeneration', 'TotalMoles', 'Volume', 'Plant', 'Harvest', 'Output',
    'PressureSetting', 'TemperatureSetting', 'TemperatureExternal', 'Filtration', 'AirRelease',
    'PositionX', 'PositionY', 'PositionZ', 'VelocityMagnitude', 'VelocityRelativeX',
    'VelocityRelativeY', 'VelocityRelativeZ', 'RatioNitrousOxide', 'PrefabHash', 'ForceWrite',
    'SignalStrength', 'SignalID', 'TargetX', 'TargetY', 'TargetZ', 'SettingInput', 'SettingOutput',
    'CurrentResearchPodType', 'ManualResearchRequiredPod', 'MineablesInVicinity',
    'MineablesInQueue', 'NextWeatherEventTime', 'Combustion', 'Fuel', 'ReturnFuelCost',
    'CollectableGoods', 'Time', 'Bpm',
];

const batchModes = [
    'Average', 'Sum', 'Minimum', 'Maximum'
];

const slotTypes = [
    'None', 'Occupied', 'OccupantHash', 'Quantity', 'Damage', 'Efficiency', 'Health', 'Growth',
    'Pressure', 'Temperature', 'Charge', 'ChargeRatio', 'Class', 'PressureWaste', 'PressureAir',
    'MaxQuantity', 'Mature', 'PrefabHash', 'Seeding',
];

const reagents = [
    'Astroloy', 'Biomass', 'Blue Coloring', 'Carbon', 'Cobalt', 'Constantan', 'Copper', 'Corn',
    'Egg', 'Electrum', 'Fenoxitone', 'Flour', 'Gold', 'Green Coloring', 'Hastelloy', 'Hydrocarbon',
    'Inconel', 'Invar', 'Iron', 'Lead', 'Milk', 'Nickel', 'Oil', 'Orange Coloring', 'Potato',
    'Pumpkin', 'Red Coloring', 'Rice', 'Silicon', 'Silver', 'Solder', 'Soy', 'Steel', 'Stellite',
    'Tomato', 'Uranium', 'Waspaloy', 'Wheat', 'Yellow Coloring'
];

const slots = [
    'Back', 'Battery', 'Bed', 'Belt', 'Brain', 'Cartridge', 'Entity', 'Export', 'Filter', 'Glasses',
    'Hand', 'Helmet', 'Import', 'Input', 'Lungs', 'Magazine', 'Motherboard', 'Occupant', 'Ore',
    'Output', 'Plant', 'Processing', 'Propellant', 'Seat', 'Storage', 'Suit', 'Tool', 'Torpedo',
    'Uniform',
    // 'Access Card', 'Air Tank', 'Appliance 1', 'Appliance 2', 'Bottle Slot', "Captain's Seat",
    // 'Cartridge1', 'Circuit Board', 'Container Slot', 'Credit Card', 'Data Disk', 'Dirt Canister',
    // 'Gas Canister', 'Gas Filter', 'Left Hand', 'Life Support', 'Liquid Canister', 'Loading Rail',
    // 'Passenger Seat Left', 'Passenger Seat Right', 'Portable Slot', 'Programmable Chip', 'Right
    // Hand', 'Sensor Processing Unit', 'Slot 0', 'Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5',
    // 'Slot 6', 'Slot 7', 'Slot 8', 'Slot 9', 'Slot 10', 'Slot 11', 'Slot 12', 'Slot 13', 'Slot
    // 14', 'Slot 15', 'Slot 16', 'Slot 17', 'Slot 18', 'Slot 19', 'Slot 20', 'Slot 21', 'Slot 22',
    // 'Slot 23', 'Slot 24', 'Slot 25', 'Slot 26', 'Slot 27', 'Slot 28', 'Slot 29', 'Transport
    // Slot', 'Waste Tank',
];

export {
    logicTypes,
    batchModes,
    slotTypes,
    reagents,
    slots,
}
