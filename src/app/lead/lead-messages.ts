export const Messages = {
  // customer

  // pickupSchedule
  '1': (cutomerName, garageName, pickupDate, pickupTime) => {
    return `Hi! ${cutomerName || 'customer'}, ${garageName} garage has accepted your service request and your pickup is scheduled at ${pickupDate} and ${pickupTime}.`
  },
  // carReached
  '2': (garageName) => {
    return `Hi! Your car has reached ${garageName} and your car servicing is under process.`
  },
  // pickupContactDetail
  '3': (cutomerName, contactPersonName, garageName, pickupDate, pickupTime, contactPersonMobileNo) => {
    return `Dear ${cutomerName || 'customer'}, ${contactPersonName} from ${garageName} will arrive at ${pickupDate},${pickupTime} today to pick up your car for servicing.You can reach him at ${contactPersonMobileNo}.\nTeam QuickFixCars`
  },
  // thankyouConfirmation

  //
  '6': (Otp, garageName, serviceOn, totalCost) => {
    return `Dear Customer, please use verification code ${Otp} to confirm you car servicing from ${garageName} on ${serviceOn} at a price of INR ${totalCost} by logging into MyAccount on QuickFixcars.com`;
  },

  '7': (garageName, garageLocation, inboundNo) => {
    return `Hi! Your car service is booked for ${garageName} at ${garageLocation}. You can reach us at ${inboundNo} for any further assistance. \nTeam QuickFixCars.`
  },

  '8': () => {
    return `QuicFixCars tried to contact you for your car servicing inquiry. To request a call back from our service advisor give us a missed call at 0124-6435210`;
  },



  // garage
  '4': (pickupDate, pickupTime) => {
    return `Dear Garage Partner, you have a new car servicing scheduled on ${pickupDate} at ${pickupTime}. Our agent will get in touch with you shortly.`
  },

  '5': (leadId) => {
    return `Dear Garage Partner, thank you for car servicing for, ${leadId}.`
  },

  // garage address SMS
}

