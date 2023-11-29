"use client";
import React, { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { MdSend } from 'react-icons/md'
import { useMutation } from '@tanstack/react-query';
import { sendFeedback } from '@/api/user.functions';
import { useToast } from '../ui/use-toast';
import userStore from '@/store/user.store';
import SigninButton from '../common/SigninButton';

type Props = {}

function FeedbackForm({ }: Props) {
    const { toast } = useToast();
    const { user } = userStore();
    const [message, setMessage] = useState("")
    const { mutate, isPending } = useMutation({
        mutationFn: sendFeedback,
        onSuccess: (data) => {
            if (!data) {
                toast({
                    variant: 'destructive',
                    description: "Error sending feedback",
                });
            } else {
                toast({
                    title: "Success",
                    description: data?.message,
                    className: 'bg-green-500 text-white'
                });
                setMessage('')
            }
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err?.message || "Error sending feedback",
            })
        }
    });

    const handleSubmit = () => {
        mutate({ message })
    }
    return (
        <div>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className='text-gray-600 mt-3' placeholder='Your feedback message..'></Textarea>
            {
                user ?
                    <Button onClick={handleSubmit} className='bg-white hover:bg-white mt-3 w-full text-primary'><MdSend size={20} /> &nbsp;  Send Feedback</Button>
                    : <SigninButton className='mt-3 w-full text-primary' />
            }
        </div>
    )
}

export default FeedbackForm