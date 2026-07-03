const AGREEMENT_TEXT = `I agree that by submitting this application, I authorize and give this dealership, as well as any potential financing source this dealership presents this application to, my consent to obtain my credit report from any credit reporting agency used to complete an investigation of my credit. By submitting this application, I certify that all information herein is true and complete. I agree I am providing this information to the dealer identified in this application and acknowledge that my information may be shared pursuant to the dealer's privacy policy, if applicable. I hereby authorize this dealer, and any financial institution engaged as a service provider by this dealer, to retain this application and to check and verify my credit, employment and salary history. By submitting this application, I authorize this dealer and/or financial institutions, as they consider necessary and appropriate, to obtain consumer credit reports on me periodically and to gather employment history in order to determine financing eligibility. Please note: If any information is missing, then the application will be rejected.`

export function ConsentAgreement({ checked, onChange }) {
  return (
    <div className="rounded-md border-l-4 border-red-600 bg-gray-50 p-4 text-sm">
      <h3 className="mb-2 font-semibold text-gray-900">
        Important Authorization
      </h3>
      <p className="whitespace-pre-line text-gray-700 leading-relaxed">
        {AGREEMENT_TEXT}
      </p>
      <label className="mt-4 flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        <span className="text-gray-800 font-medium">
          I have read and agree to these authorization terms.
        </span>
      </label>
    </div>
  )
}
