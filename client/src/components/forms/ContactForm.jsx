// client/src/components/forms/ContactForm.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '../../services/api'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { Spinner } from '../ui/Spinner'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone is required'),
  topic: z.enum(
    ['General inquiry', 'Inventory', 'Financing', 'Trade-In', 'Service'],
    { message: 'Select a topic' }
  ),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

const topicOptions = [
  { label: 'General Inquiry', value: 'General inquiry' },
  { label: 'Inventory',       value: 'Inventory' },
  { label: 'Financing',       value: 'Financing' },
  { label: 'Trade-In',        value: 'Trade-In' },
  { label: 'Service',         value: 'Service' }
]

export function ContactForm() {
  const [serverError, setServerError]   = useState('')
  const [serverSuccess, setServerSuccess] = useState('')
  const [loading, setLoading]           = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '', email: '', phone: '',
      topic: 'General inquiry', subject: '', message: ''
    }
  })

  const submit = async (data) => {
    setServerError('')
    setServerSuccess('')
    setLoading(true)
    try {
      await api.post('/contact', data)
      setServerSuccess(
        'Your message has been sent. We\'ll respond as soon as possible.'
      )
      reset()
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
        'Unable to send your message right now. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(submit)}
      noValidate
    >
      {serverError && (
        <Alert variant="error" title="Submission error">
          {serverError}
        </Alert>
      )}
      {serverSuccess && (
        <Alert variant="success" title="Message sent">
          {serverSuccess}
        </Alert>
      )}

      {/* Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input label="Name" id="cf-name" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Input
            label="Email" id="cf-email" type="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Phone + Topic */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            label="Phone" id="cf-phone" type="tel"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <Select
            label="Topic" id="cf-topic"
            options={topicOptions}
            {...register('topic')}
          />
          {errors.topic && (
            <p className="text-xs text-red-600 mt-1">{errors.topic.message}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <Input
          label="Subject" id="cf-subject"
          placeholder="Brief description of your enquiry"
          {...register('subject')}
        />
        {errors.subject && (
          <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <Textarea
          label="Message" id="cf-message" rows={5}
          placeholder="Share your question or request in detail."
          {...register('message')}
        />
        {errors.message && (
          <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" size="md" disabled={loading}>
          {loading ? (
            <>
              <Spinner size={14} />
              <span className="ml-2">Sending…</span>
            </>
          ) : (
            'Send message'
          )}
        </Button>
        <p className="text-xs text-brand-muted">
          We respect your time and will respond promptly during business hours.
        </p>
      </div>
    </form>
  )
}