const profile = require("../../../schemas/ProfileSchema");

module.exports = {
    cropGetFarm: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        });

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        };
        return x.farms.crops; // Returns planted crops
    },
    cropGetCrops: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) {
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        return x.inventory.farms.crops; // Returns inventory crops
    },
    cropDelPlants: async function (userID, type, amount) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        x.farms.crops[type] = x.farms.crops[type] - amount; // Deletes amount from their crops
        if(x.farms.crops[type] < 0) { // If plants is under 0
            x.farms.crops[type] = 0; // Set plants to 0 to prevent negatives
        }
        x.save(); // Save to database

        return x.farms.crops; // Returns farm crops
    },
    cropAddCrops: async function (userID, crops) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(crops.wheat) { // If provided obj has wheat
            x.inventory.farms.crops.wheat = x.inventory.farms.crops.wheat + crops.wheat;
        }
        if(crops.melon) { // If provided obj has melon
            x.inventory.farms.crops.melon = x.inventory.farms.crops.melon + crops.melon;
        }
        if(crops.pumpkin) { // If provided obj has pumpkin
            x.inventory.farms.crops.pumpkin = x.inventory.farms.crops.pumpkin + crops.pumpkin;
        }
        if(crops.strawberry) { // If provided obj has strawberry
            x.inventory.farms.crops.strawberry = x.inventory.farms.crops.strawberry + crops.strawberry;
        }
        if(crops.coffee) { // If provided obj has coffee
            x.inventory.farms.crops.coffee = x.inventory.farms.crops.coffee + crops.coffee;
        }
        if(crops.peach) { // If provided obj has peach
            x.inventory.farms.crops.peach = x.inventory.farms.crops.peach + crops.peach;
        }
        if(crops.apple) { // If provided obj has apple
            x.inventory.farms.crops.apple = x.inventory.farms.crops.apple + crops.apple;
        }
        x.save(); // Save to database
        return crops.wheat + crops.melon + crops.pumpkin + crops.strawberry + crops.coffee + crops.peach + crops.apple; // Returns all items added together
    },
    cropPlant: async function (userID, crop, amount) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })
        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        x.inventory.farms.crops[crop] = x.inventory.farms.crops[crop] - amount; // Removes crops from inventory
        x.farms.crops[crop] = x.farms.crops[crop] + amount; // Adds amount to planted crops
        x.save(); // Save to database
        return x.farms.crops[crop]; // Returns new amount
    },
    cropPlantAll: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices"); // Gets obj of items
        var cropItems = Object.keys(cropPrices.prices); // Returns only item names in array
        var itemPrices = { ...cropItems}; // Useless but like still here
        var plantedCount = 0; 
        for(crop in itemPrices) {
            plantedCount = plantedCount + x.inventory.farms.crops[itemPrices[crop]]; // Adds to amount planted
            x.farms.crops[itemPrices[crop]] = x.farms.crops[itemPrices[crop]] + x.inventory.farms.crops[itemPrices[crop]]; // Adds to planted crops
            x.inventory.farms.crops[itemPrices[crop]] = 0; // Clears crop inventory
        }
        x.save(); // Save to database
        return plantedCount;
    },
    cropSellAll: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices"); // Gets obj of items
        var cropItems = Object.keys(cropPrices.prices); // Returns only item names in array
        var itemPrices = { ...cropItems}; // Useless but like still here
        var moneyToAdd = 0;
        for(crop in itemPrices) {
            moneyToAdd = moneyToAdd + cropPrices.prices[itemPrices[crop]] * x.inventory.farms.crops[itemPrices[crop]]; // Multiplies price by amount in inventory
            x.inventory.farms.crops[itemPrices[crop]] = 0; // Clears inventory crop;
        }
        x.econ.balance = x.econ.balance + moneyToAdd; // Adds money to balance
        x.save(); // Save to database
        return;
    },
    cropHarvest: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices"); // Gets obj of items
        var cropItems = Object.keys(cropPrices.prices); // Returns only item names in array
        var itemPrices = { ...cropItems}; // Useless but like still here
        var harvestCount = 0; 
        for(crop in itemPrices) {
            var amount = Math.floor(Math.ceil(x.farms.crops[itemPrices[crop]] * 0.25));
            harvestCount = harvestCount + amount; // Adds to amount planted
            x.inventory.farms.crops[itemPrices[crop]] = x.inventory.farms.crops[itemPrices[crop]] + amount; // Adds to inventory crops
        }
        x.save(); // Save to database
        return harvestCount;
    },
    cropAddFertilize: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farm.crops.fertilized == false) { // if the farm isnt fertilized
            x.farm.crops.fertilized = true; // fertilize farm
        }
        x.save(); // Save to database
        return x;
    },
    cropDelFertilize: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farm.crops.fertilized == true) { // if the farm is fertilized
            x.farm.crops.fertilized = false; // unfertilize farm
        }
        x.save(); // Save to database
        return x;
    },
    cropGetFertilized: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farms.crops.fertilized == true) {
            return true;
        } else {
            return false;
        }
    },
    cropAddProtected: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farm.crops.protected == false) { // if the farm isnt protected
            x.farm.crops.protected = true; // protect farm
        }
        x.save();
        return x;
    },
    cropDelProtected: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farm.crops.protected == true) { // if the farm is protected
            x.farm.crops.protected = false; // unprotect farm
        }
        x.save();
        return x;
    },
    cropAddTractorUse: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.uses.tractor >= 5) {
            x.inventory.items.farmTools.tractor = x.inventory.items.farmTools.tractor - 1; // Remove tractor from inventory
            x.uses.tractor = 0; // Resets tractor uses
            x.save(); // Save to database
            return "broke"; // Returns broke
        } else {
            x.uses.tractor = x.uses.tractor + 1; // Adds tractor use
            x.save(); // Save to database
        }
        return;
    },
    cropGetTractors: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        return x.inventory.items.farmTools.tractor;
    },
    cropGetProtected: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.farms.crops.protected == true) {
            return true;
        } else {
            return false;
        }
    },
    cropAddScarecrowUse: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        if(x.uses.scarecrow >= 5) {
            x.inventory.items.farmTools.scarecrow = x.inventory.items.farmTools.scarecrow - 1; // Removes 1 scarecrow from inventory
            x.uses.scarecrow = 0; // Resets uses
            x.save(); // Save to database
            return "broke"; // Returns broke
        } else {
            x.uses.scarecrow = x.uses.scarecrow + 1; // Adds scarecrow use
            x.save(); // Save to database
        }
        return;
    },
    cropGetScarecrows: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        return x.inventory.items.farmTools.scarecrow;
    },
    cropGetFarmCount: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices"); // Gets prices from obj
        var cropItems = Object.keys(cropPrices.prices); // Gets item names only
        var itemPrices = { ...cropItems}; // Does nothing but like
        var amount = 0; 

        for(crop in itemPrices) {
            amount = amount + x.farms.crops[itemPrices[crop]]; // Adds to amount for every planted crop
        }
        return amount;
    },
    cropGetInvenCount: async function (userID) {
        let x = await profile.findOne({ userID: userID}, async function (err, res) { // Requesting User Object
            if (err) throw err; // Throwing if error
            if(res) {
                return res; // Letting x = obj;
            }
        })

        if(!x) { // If user obj didnt exist
            x = await profile.create({ // Creating profile obj
                userID: userID
            });
        }
        var cropPrices = require("../../../handlers/cropFarm/Shop/Prices/farmPrices"); // Gets prices from obj
        var cropItems = Object.keys(cropPrices.prices); // Gets item names only
        var itemPrices = { ...cropItems}; // Does nothing but like
        var amount = 0;

        for(crop in itemPrices) {
            amount = amount + x.inventory.farms.crops[itemPrices[crop]]; // Adds to amount for every plant in inventory
        }
        return amount;
    }
}