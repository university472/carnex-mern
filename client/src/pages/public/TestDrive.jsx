import { TestDriveForm } from '../../components/forms/TestDriveForm'
import { submitTestDriveRequest } from '../../services/testDriveService'

export function TestDrive() {
  const handleSubmit = async (data) => {
    await submitTestDriveRequest(data)
  }

  return (
    <section className="page-content space-y-6">
      ...
      <TestDriveForm onSubmit={handleSubmit} />
    </section>
  )
}
