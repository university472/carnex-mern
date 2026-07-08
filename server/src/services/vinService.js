// const axios = require('axios')

// async function decodeVin(vin) {
//   const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`

//   const { data } = await axios.get(url)

//   const info = data.Results[0]

//   return {
//     vin,

//     make: info.Make,
//     model: info.Model,
//     year: info.ModelYear,

//     bodyType: info.BodyClass,

//     fuelType: info.FuelTypePrimary,

//     specs: {
//       trim: info.Trim,

//       doors: info.Doors,

//       engine: {
//         size: info.DisplacementL,
//         cylinders: info.EngineCylinders,
//         horsepower: info.EngineHP
//       },

//       transmission: {
//         type: info.TransmissionStyle
//       }
//     }
//   }
// }

// module.exports = {
//   decodeVin
// }

const axios = require('axios')

async function decodeVin(vin) {
  // ===============================
  // 1) NHTSA VIN DECODE
  // ===============================

  const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`

  const { data } = await axios.get(nhtsaUrl)

  const vinInfo = data.Results[0]

  // ===============================
  // 2) API NINJAS SPEC LOOKUP
  // ===============================

  let ninjaInfo = {}

  try {
    const ninjaRes = await axios.get('https://api.api-ninjas.com/v1/cars', {
      params: {
        make: vinInfo.Make,
        model: vinInfo.Model,
        year: vinInfo.ModelYear
      },

      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY
      }
    })

    if (ninjaRes.data.length > 0) {
      ninjaInfo = ninjaRes.data[0]
    }
  } catch (error) {
    console.log('API Ninjas failed:', error.message)
  }

  // ===============================
  // MERGE RESPONSE
  // ===============================

  return {
    vin,

    // basic

    make: vinInfo.Make,

    model: vinInfo.Model,

    year: vinInfo.ModelYear,

    trim: vinInfo.Trim,

    // body

    bodyType: vinInfo.BodyClass || ninjaInfo.class,

    vehicleType: vinInfo.VehicleType,

    doors: vinInfo.Doors,

    // fuel

    fuelType: vinInfo.FuelTypePrimary || ninjaInfo.fuel_type,

    // specs

    specs: {
      engine: {
        size: vinInfo.DisplacementL,

        cylinders: vinInfo.EngineCylinders || ninjaInfo.cylinders,

        horsepower: vinInfo.EngineHP,

        configuration: vinInfo.EngineConfiguration,

        model: vinInfo.EngineModel
      },

      transmission: {
        type: vinInfo.TransmissionStyle || ninjaInfo.transmission
      },

      drivetrain: {
        driveType: vinInfo.DriveType || ninjaInfo.drive
      },

      fuelEconomy: {
        cityMpg: ninjaInfo.city_mpg,

        highwayMpg: ninjaInfo.highway_mpg,

        combinedMpg: ninjaInfo.combination_mpg
      },

      manufacturing: {
        manufacturer: vinInfo.Manufacturer,

        plantCountry: vinInfo.PlantCountry,

        plantCity: vinInfo.PlantCity,

        plantCompany: vinInfo.PlantCompanyName
      },

      safety: {
        seatBelts: vinInfo.SeatBeltsAll,

        airbags: {
          front: vinInfo.AirBagLocFront,

          side: vinInfo.AirBagLocSide,

          curtain: vinInfo.AirBagLocCurtain
        }
      }
    }
  }
}

module.exports = {
  decodeVin
}
