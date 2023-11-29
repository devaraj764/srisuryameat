"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import userStore from '@/store/user.store';
import { Separator } from '../ui/separator';
import { useMutation } from '@tanstack/react-query';
import { updateUserDetails } from '@/api/user.functions';
import { useToast } from '../ui/use-toast';

// Define a schema for validation using Zod
const schema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  mobile: z.string().min(10).max(10),
  whatsapp: z.string().min(10).max(10),
});

type FormData = z.infer<typeof schema>;


function UpdateProfile() {
  const { user, setUserData } = userStore();
  const [editMode, setEditMode] = useState(false);
  const initialvalues: FormData = {
    name: user?.name || '',
    email: user?.email || '', // @ts-ignore
    mobile: user?.mobile, // @ts-ignore
    whatsapp: user?.whatsapp
  }
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: initialvalues
  });
  const { toast } = useToast();

  const onSubmit = (data: FormData) => {
    console.log(data);
    mutate(data)
    // You can handle form submission logic here
    handleCancel();
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    reset(); // Reset form fields to their initial values
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateUserDetails,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
        className: 'bg-green-500 text-white'
      })
      setUserData()
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        description: err.message,
      })
    }
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <h5 className='text-lg text-gray-900 py-2'>Contact Details</h5>
        {
          !editMode &&
          <Button variant={'link'} onClick={handleEdit}>Edit</Button>
        }
      </div>
      <Separator className='mb-5' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <label className='mb-3 text-sm text-gray-700'>Name</label>
          <Input {...register('name')} disabled={!editMode} placeholder='Your full name' />
          {errors.name && <span>Name is required</span>}
        </div>

        <div className='mb-3'>
          <label className='mb-3 text-sm text-gray-700'>Email</label>
          <Input {...register('email')} disabled={true} placeholder='Your email address' />
          {errors.email && <span>Enter a valid email address</span>}
        </div>

        <div className='mb-3'>
          <label className='mb-3 text-sm text-gray-700'>Mobile</label>
          <Input defaultValue={user?.mobile || ''} {...register('mobile')} disabled={!editMode} placeholder='Your 10 digit mobile number' />
          {errors.mobile && <span>Mobile number should be at least 10 digits</span>}
        </div>

        <div className='mb-3'>
          <label className='mb-3 text-sm text-gray-700'>Whatsapp</label>
          <Input defaultValue={user?.whatsapp || ''} {...register('whatsapp')} disabled={!editMode} placeholder='Your active whatsapp number' />
          {errors.whatsapp && <span>Whatsapp number should be at least 10 digits</span>}
        </div>
        {editMode &&
          <footer className='mt-5 flex items-center justify-end w-full gap-3 mb-2'>
            <Button className='bg-gray-400 hover:bg-gray-500' type="button" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" disabled={isPending}>Update</Button>
          </footer>
        }
      </form>
    </>
  )
}

export default UpdateProfile