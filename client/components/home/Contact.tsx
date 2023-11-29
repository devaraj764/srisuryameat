import React from 'react'
import { Separator } from '../ui/separator'
import FeedbackForm from './FeedbackForm'

type Props = {}

function Contact({ }: Props) {
  return (
    <div className="bg-white">
      <div className='max-w-[1200px] mx-auto px-3 py-10'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border p-3 md:p-5 rounded-md">
            <h3 className='text-xl font-bold text-primary'>Contact Details</h3>
            <Separator className='mt-2 mb-5' />
            <p className='text-md'>Address:</p>
            <p className='text-sm text-gray-400'>Balacheruvu Rd, Azeemabad, Pedagantyada, Visakhapatnam, Andhra Pradesh 530044</p>
            <p className='text-md mt-2'>Phone:</p>
            <a href="tel:+918341535915" className='text-sm text-gray-400'>+91 8341535915</a>
            <div className='bg-primary rounded-md p-3 mt-5 text-white'>
              <p className='text-md'>Feedback:</p>
              <p className='text-xs text-gray-200'>Absolutely, feedback is crucial! It&apos;s like a compass guiding us toward improvement, helping us enhance our services and better meet your needs.</p>
              <FeedbackForm/>
            </div>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3801.471758982934!2d83.20973507517154!3d17.67516068326201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDQwJzMwLjYiTiA4M8KwMTInNDQuMyJF!5e0!3m2!1sen!2sin!4v1701040107204!5m2!1sen!2sin"
            className='rounded-md p-2 border h-full w-full min-h-[360px]'
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy={'no-referrer-when-downgrade'}>
          </iframe>
        </div>
      </div>
    </div>
  )
}

export default Contact