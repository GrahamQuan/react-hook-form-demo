import { useForm, useFieldArray, FieldErrors } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { useEffect } from 'react'

type FormValues = {
  username: string
  email: string
  channel: string
  social: {
    facebook: string
    twitter: string
  }
  phoneNums: string[]
  phNums: { number: string }[]
  age: number
  date: Date
}

let count = 0

export const YoutubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: 'John',
      email: '',
      channel: '',
      social: {
        facebook: '',
        twitter: '',
      },
      phoneNums: ['', ''],
      phNums: [{ number: '' }],
      age: 0,
      date: new Date(),
    },
    // mode: 'onChange',
  })

  // const form = useForm<FormValues>({
  //   defaultValues: async () => {
  //     const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
  //     const data = await res.json()
  //     return {
  //       username: 'Jack',
  //       email: data.email,
  //       channel: '',
  //     }
  //   },
  // })

  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
  } = form
  // const { name, ref, onChange, onBlur } = register('username')
  const {
    errors,
    dirtyFields,
    touchedFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount,
  } = formState
  console.log(isSubmitting, isSubmitted, isSubmitSuccessful, submitCount)
  // console.log(dirtyFields, touchedFields, isDirty)

  const { fields, append, remove } = useFieldArray({
    name: 'phNums',
    control,
  })

  // const watchALL = watch()
  // const watchOne = watch('username')
  // const watchMany = watch(['username', 'email'])

  // useEffect(() => {
  //   const subscription = watch((values) => {
  //     console.log(values)
  //   })

  //   return () => subscription.unsubscribe()
  // }, [watch])

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  const onTrigger = () => {
    trigger() // all
    // trigger('channel')
  }

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log('onError', errors)
  }

  const onSubmit = (data: FormValues) => {
    console.log('onSubmit', data)
  }

  const onGetValues = () => {
    // const data = getValues('username')
    const data = getValues(['age', 'social'])
    console.log(data)
  }

  const onSetValue = () => {
    // setValue('username', '', {
    //   shouldDirty: true,
    //   shouldValidate: true,
    //   shouldTouch: true,
    // })
    setValue('username', 'Jim')
    setValue('email', 'test@test.com')
    setValue('channel', 'channel_123')
    setValue('social', {
      facebook: 'facebook',
      twitter: 'twitter',
    })
    setValue('phoneNums', ['111', '222'])
    setValue('phNums', [{ number: '333' }])
    setValue('age', 18)
    setValue('date', new Date())
  }

  count++

  return (
    <div>
      <h1>React Hook Form: {count}</h1>
      {/* <h3>watch:{JSON.stringify(watchMany)}</h3> */}
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          {/* <input type="text" id="username" name={name} ref={ref} onChange={onChange} onBlur={onBlur} /> */}
          <input
            type="text"
            id="username"
            {...register('username', { required: 'Username is required' })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-control"></div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              pattern: {
                value: /^\S+@\S+\.\S+$/i,
                message: 'Invalid email address',
              },
              // (1) validation
              // validate: (fieldValue) => {
              //   return (
              //     fieldValue !== 'admin@admin.com' ||
              //     'Enter a different email address'
              //   )
              // },
              // (2) custom validation
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== 'admin@admin.com' ||
                    'Enter a different email address'
                  )
                },
                notBlockedList: (fieldValue) => {
                  return (
                    !fieldValue.endsWith('domain.com') || 'Domian not supported'
                  )
                },
                emailAvailable: async (fieldValue) => {
                  const res = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  )
                  const data = await res.json()
                  return data.length === 0 || 'Email already exists'
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register('channel', {
              required: {
                value: true,
                message: 'Channel is required',
              },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        {/* nested object */}
        <div className="form-control">
          <label htmlFor="facebook">facebook</label>
          <input
            type="text"
            id="facebook"
            className={`${watch('channel') === '' ? 'disabled' : ''}`}
            {...register('social.facebook', {
              disabled: watch('channel') === '',
            })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="twitter">twitter</label>
          <input type="text" id="twitter" {...register('social.twitter')} />
        </div>

        {/* (1) array */}
        <div className="form-control">
          <label htmlFor="primary-phone">primary phone</label>
          <input type="text" id="primary-phone" {...register('phoneNums.0')} />
        </div>
        <div className="form-control">
          <label htmlFor="secondary-phone">secondary phone</label>
          <input
            type="text"
            id="secondary-phone"
            {...register('phoneNums.1')}
          />
        </div>

        {/* (2) array: dynamic */}
        <div>
          {fields.map((field, index) => (
            <div className="row" key={field.id}>
              <div className="form-control">
                <input
                  type="text"
                  id={field.id}
                  {...register(`phNums.${index}.number` as const)}
                />
              </div>
              <button onClick={() => remove(index)}>remove</button>
            </div>
          ))}
          <button onClick={() => append({ number: '' })}>add</button>
        </div>

        {/* value default type is string */}
        <div className="form-control">
          <label htmlFor="age">age</label>
          <input
            type="number"
            id="age"
            {...register('age', { valueAsNumber: true })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="date">date</label>
          <input
            type="date"
            id="date"
            {...register('date', { valueAsDate: true })}
          />
        </div>

        <button
          className={`${!isValid && 'disabled'}`}
          disabled={!isValid}
          type="submit"
        >
          Submit
        </button>
        <button type="button" onClick={() => reset()}>
          reset
        </button>
        <button type="button" onClick={onTrigger}>
          validate
        </button>
        <button type="button" onClick={onGetValues}>
          get Values
        </button>
        <button type="button" onClick={onSetValue}>
          set value
        </button>
      </form>
      <DevTool control={control} />
    </div>
  )
}
