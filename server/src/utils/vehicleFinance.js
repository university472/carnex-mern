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
  // Cost Price is stored under the original `purchasePrice` key so existing
  // records keep their data.
  const costPrice = num(inputs.purchasePrice)

  const totalAcquisitionCost = costPrice

  const totalReconCost = num(inputs.reconditioningCost) + num(inputs.otherPrepCost)

  const totalInvestment = totalAcquisitionCost + totalReconCost

  // "Sold For" entered on the finance page wins; otherwise fall back to the
  // price recorded by "Complete Sale".
  const grossSaleAmount = num(inputs.soldFor) > 0 ? num(inputs.soldFor) : num(soldPrice)

  const collectedAmount = num(inputs.collectedAmount)
  const dmvFeePaid = num(inputs.dmvFeePaid)

  const amountAfterFee = collectedAmount - dmvFeePaid

  const profit = amountAfterFee - costPrice

  const totalExpenses =
    dmvFeePaid +
    num(inputs.registrationFee) +
    num(inputs.titleFee) +
    num(inputs.discountGiven) +
    num(inputs.otherSaleCost)

  const companyTaxCost = num(inputs.taxRemittedByCompany) + num(inputs.otherTaxesFees)

  const totalTaxes = num(inputs.customerSalesTax) + companyTaxCost

  const netCost = totalInvestment + totalExpenses + companyTaxCost

  const grossProfit = profit

  // Equivalent to: profit − recon/prep − other sale costs − company taxes
  const netProfit = collectedAmount - netCost

  return {
    totalAcquisitionCost,
    totalReconCost,
    totalInvestment,
    grossSaleAmount,
    amountAfterFee,
    profit,
    totalExpenses,
    totalTaxes,
    netCost,
    grossProfit,
    netProfit
  }
}

module.exports = { computeFinanceTotals }
