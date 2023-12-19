"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "../ui/use-toast";

type Props = {
    title: React.ReactNode,
    callback: () => Promise<any>,
    message?: string,
    actionTitle?: string,
    successMesssage?: string
}

function ConfirmDialog({ callback, message, actionTitle, title, successMesssage }: Props) {
    const { isPending, mutate } = useMutation({
        mutationKey:['delete-product'],
        mutationFn: callback,
        onSuccess: () => {
            toast({
                title: 'Success',
                description: successMesssage || ''
            })
        }
    })
    return (
        <AlertDialog>
            <AlertDialogTrigger>{title}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message || 'This action cannot be undone.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={() => mutate()}>{actionTitle || 'Continue'}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmDialog