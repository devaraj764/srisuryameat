'use client';
import Link from 'next/link'
import React from 'react'
import { GiMeat } from 'react-icons/gi'
import { FaBoxesStacked, FaHeart, FaUser } from 'react-icons/fa6'
import { AiFillHome, AiOutlineShoppingCart } from 'react-icons/ai'
import SignInButton from './SigninButton'
import { Bebas_Neue } from 'next/font/google'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { Button } from '../ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import userStore from '@/store/user.store';
import { categories } from '@/lib/constants';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MdArrowDropDown } from 'react-icons/md';
import BrandLogo from '@/app/assets/brand-logo.png'
import { IoIosArrowDown } from 'react-icons/io';

type Props = {}
const bebas = Bebas_Neue({
    variable: '--font-bebas_neue',
    weight: ['400'],
    subsets: ['latin']
})

const Navbar = (props: Props) => {
    const { user } = userStore();
    return (
        <div className="fixed top-0 w-full border-b bg-white z-40">
            <div className="max-w-[1400px] mx-auto px-3">
                <div className='flex items-center justify-between px-1 py-4'>
                    <div className="flex items-center gap-1">
                        <Link href='/' className='flex items-center gap-2'>
                            <Image src={BrandLogo} alt="Surya Meat Hub Brand Logo" className='rounded-md scale-125' width={42} height={42} />
                            <h1 className={`text-3xl font-extrabold text-[#da2944] ${bebas.className}`}>
                                SRI SURYA MEAT
                            </h1>
                        </Link>
                    </div>
                    <NavigationMenu className='text-gray-500'>
                        <NavigationMenuList className='gap-5 hidden md:flex'>
                            {/* home */}
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle() + ' ' + 'bg-transparent'}>
                                        <AiFillHome size='22' /> &nbsp;  Home
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            {/* products */}
                            <NavigationMenuItem >
                                <NavigationMenuTrigger className='bg-trnasparent'>
                                    <Link href="/products">
                                        <div className="flex items-center">
                                            <GiMeat size='28' /> &nbsp; Products
                                        </div>
                                    </Link>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className='p-3'>
                                    <h1 className="text-bold">Categories</h1>
                                    <Separator className='mb-3 mt-2' />
                                    <div className='w-[500px] grid grid-cols-3 gap-3'>
                                        {categories.map((items, index) => (
                                            <Link key={index} href={`/products?category=${items.variable}`} className='w-full'>
                                                <Button className='w-full hover:text-[#da2944]' variant={'outline'}>
                                                    {items.icon} &nbsp; {items.tag}
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {
                                user ?
                                    <>
                                        {/* Sign In */}
                                        <NavigationMenuItem className='relative'>
                                            <Link href="/cart">
                                                <Button className='hover:bg-[#da294411]' variant={'outline'}>
                                                    <AiOutlineShoppingCart size='22' /> &nbsp; Cart &nbsp;
                                                    <p className="h-5 w-5 flex items-center justify-center bg-[#da2944] text-white rounded-full">
                                                        {user.cart.length}
                                                    </p>
                                                </Button>
                                            </Link>
                                        </NavigationMenuItem>

                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger className='bg-transparent'>
                                                <Link href="/profile">
                                                    <div className="flex items-center">
                                                        <Image src={user.profileImage} alt={user.name} height={38} width={38} className='rounded-full' />
                                                    </div>
                                                </Link>
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className='w-full p-3 mx-auto'>
                                                <h1 className="text-bold">My Account</h1>
                                                <Separator className='mb-3 mt-2' />
                                                <div className='w-[500px] grid grid-cols-2 gap-3'>
                                                    <Link href={`/profile`} className='w-full'>
                                                        <Button className='w-full hover:text-[#da2944]' variant={'outline'}>
                                                            <FaUser size='18' /> &nbsp; {user.name}
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/wishlist`} className='w-full'>
                                                        <Button className='w-full hover:text-[#da2944]' variant={'outline'}>
                                                            <FaHeart size='18' /> &nbsp; Wishlist
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/orders`} className='w-full'>
                                                        <Button className='w-full hover:text-[#da2944]' variant={'outline'}>
                                                            <FaBoxesStacked size='18' /> &nbsp; Orders
                                                        </Button>
                                                    </Link>
                                                    <SignInButton className='w-full' />
                                                </div>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    </>
                                    :

                                    <NavigationMenuItem className='bg-gray'>
                                        <SignInButton />
                                    </NavigationMenuItem>
                            }

                        </NavigationMenuList>
                        <NavigationMenuList className='md:hidden'>
                            {
                                user ?
                                    <NavigationMenuItem>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className='flex items-center'>
                                                <Image src={user.profileImage} alt={user.name} height={38} width={38} className='rounded-full' /> &nbsp; <IoIosArrowDown />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <Link href='/profile'>
                                                    <DropdownMenuItem className='mb-2'>
                                                        <FaUser size='18' /> &nbsp; Profile
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href='/wishlist'>
                                                    <DropdownMenuItem className='mb-2'>
                                                        <FaHeart size='18' /> &nbsp; Wishlist
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem><SignInButton className='w-full' /></DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </NavigationMenuItem>
                                    :

                                    <NavigationMenuItem className='bg-gray'>
                                        <SignInButton />
                                    </NavigationMenuItem>
                            }
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
            <nav className='bg-white md:hidden fixed flex justify-around bottom-0 w-full text-gray-500 pt-3 pb-2 text-sm border-t'>
                <Link href='/' className="flex flex-col items-center cursor-pointer">
                    <AiFillHome size='24' />
                    <p className='text-xs'>Home</p>
                </Link>
                <Link href='/products' className="flex flex-col items-center cursor-pointer">
                    <GiMeat size='24' className='scale-125' />
                    <p className='text-xs'>Products</p>
                </Link>
                <Link href='/orders' className="flex flex-col items-center cursor-pointer">
                    <FaBoxesStacked size='24' />
                    <p className='text-xs'>Orders</p>
                </Link>
                <Link href='/cart' className="flex flex-col items-center cursor-pointer">
                    <AiOutlineShoppingCart size='24' />
                    <p className='text-xs'>Cart <span className='text-white px-2 rounded-full bg-primary'>{user?.cart.length}</span></p>
                </Link>
            </nav>
        </div>

    )
}

export default Navbar