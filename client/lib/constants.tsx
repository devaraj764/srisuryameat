import { GiCirclingFish, GiFishCorpse, GiFlatfish, GiGoat, GiMeat, GiRoastChicken, GiShrimp, GiSpearfishing } from 'react-icons/gi'
import { FaCloudMeatball, FaFishFins } from 'react-icons/fa6'

export const categories = [
    {
        icon: <GiRoastChicken size='22' />,
        tag: 'Chicken',
        variable: 'chicken',
        image: 'https://poultry.mystagingwebsite.com/wp-content/uploads/2019/02/shutterstock_531404539-1024x684.jpg'
    },
    {
        icon: <GiGoat size='22' />,
        tag: 'Mutton',
        variable: 'mutton',
        image: 'https://www.bigbasket.com/media/uploads/p/xxl/40048913_4-fresho-mutton-curry-cut-from-whole-carcass-8-10-pcs-antibiotic-residue-free-growth-hormone-free.jpg'
    },
    {
        icon: <GiFlatfish size='22' />,
        tag: 'Fish',
        variable: 'fish',
        image:'https://static.toiimg.com/thumb/101288661.cms?width=680&height=512&imgsize=195572'
    },
    {
        icon: <GiSpearfishing size='22' />,
        tag: 'Sea Fish',
        variable: 'sea-fish',
        image:'https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2018/04/istock-520490716.jpg'
    },
    {
        icon: <GiCirclingFish size='22' />,
        tag: 'Live Fish',
        variable: 'live-fish',
        image:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Fish_stuffed_with_Thai_herbs.jpg/260px-Fish_stuffed_with_Thai_herbs.jpg'
    },
    {
        icon: <FaFishFins size='18' />,
        tag: 'Fish Boneless',
        variable: 'fish-boneless',
        image:'https://udaipurmeathouse.com/wp-content/uploads/2022/02/fish-bl03.png'
    },
    {
        icon: <GiShrimp size='22' />,
        tag: 'Prawns',
        variable: 'prawns',
        image:'https://static.freshtohome.com/media/catalog/product/cache/1/image/18ae109e34f485bd0b0c075abec96b2e/t/i/tiger_prawns_pud_2_4.jpg'
    },
    {
        icon: <GiFishCorpse size='22' />,
        tag: 'Dry Fish',
        variable: 'dry-fish',
        image:'https://morningchores.com/wp-content/uploads/2021/06/drying-fish.jpg'
    },
    {
        icon: <FaCloudMeatball size='18' />,
        tag: 'Combo Pack',
        variable: 'combo-pack',
        image:'https://assets.tendercuts.in/product/C/O/c03b57f3-194a-49ea-ab98-614a58664482.webp'
    },
    {
        icon: <GiMeat size='22' />,
        tag: 'Other Meat',
        variable: 'other-meat',
        image:'https://www.futurefit.co.uk/wp-content/uploads/2019/09/shutterstock_726842485-scaled.jpg'
    },
]
