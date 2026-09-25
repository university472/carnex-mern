// server/src/utils/vehicleFinance.js
// Single source of truth for vehicle profit math — used by both the
// per-vehicle finance update endpoint and the "mark as sold" status endpoint
// so the numbers can never drift apart.

function num(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

/**
 * @param {Object} inputs - raw finance fields (a Vehicle.finance object)
 * @param {number} soldPrice - the vehicle's soldPrice (0/undefined if not sold)
 * @returns {Object} totals matching Vehicle.finance.totals
 */
function computeFinanceTotals(inputs = {}, soldPrice = 0) {
  const totalAcquisitionCost =
    num(inputs.purchasePrice) +
    num(inputs.acquisitionTax) +
    num(inputs.acquisitionFees) +
    num(inputs.transportationCost) +
    num(inputs.auctionFees) +
    num(inputs.otherAcquisitionCost)

  const totalReconCost = num(inputs.reconditioningCost) + num(inputs.otherPrepCost)

  const totalInvestment = totalAcquisitionCost + totalReconCost

  const grossSaleAmount = num(soldPrice)

  const totalExpenses =
    num(inputs.registrationFee) +
    num(inputs.titleFee) +
    num(inputs.discountGiven) +
    num(inputs.otherSaleCost)

  const companyTaxCost = num(inputs.taxRemittedByCompany) + num(inputs.otherTaxesFees)

  const totalTaxes = num(inputs.customerSalesTax) + companyTaxCost

  const netCost = totalInvestment + totalExpenses + companyTaxCost

  const grossProfit = grossSaleAmount - totalInvestment

  const netProfit = grossSaleAmount - netCost

  return {
    totalAcquisitionCost,
    totalReconCost,
    totalInvestment,
    grossSaleAmount,
    totalExpenses,
    totalTaxes,
    netCost,
    grossProfit,
    netProfit
  }
}

module.exports = { computeFinanceTotals }
