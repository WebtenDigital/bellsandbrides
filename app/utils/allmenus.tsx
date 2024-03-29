import { db } from "./db.server"
import setIcon from "./iconsetter"

type SubLink={
    name: string,
    url: string
}

export type MenuLink={
    name: string
    url: string
    sublinks?: SubLink[]
    icon?: JSX.Element
}

// lg main menu
export const MainMenu:MenuLink[]=[
    {
        name:"Planner",
        url: '/dashboard',
        sublinks: [
            {
                name: "Your Function",
                url: "/dashboard/function"
            },
            {
                name: "Manage Vendors",
                url: "/dashboard/vendors"
            },
            {
                name: "Registry",
                url: "/dashboard/registry"
            }
        ],
        icon: <svg className="fill-gray-700 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 356.526 356.526"><path d="m218.255 113.943 29.936-39.527c2.168-2.864 1.855-7.075-.716-9.587L183.992 2.82C182.659 1.519 180.183 0 177.588 0c-2.624 0-5.105 1.554-6.432 2.884l-62.169 62.309c-2.536 2.541-2.841 6.636-.71 9.525l29.147 39.525c-48.697 16.945-83.745 63.304-83.745 117.701 0 68.695 55.888 124.583 124.584 124.583s124.584-55.888 124.584-124.583c0-54.715-35.453-101.303-84.592-118.001zm-39.992 212.583c-52.154 0-94.584-42.43-94.584-94.583 0-52.154 42.43-94.584 94.584-94.584s94.584 42.43 94.584 94.584c0 52.153-42.43 94.583-94.584 94.583z"/></svg>
    },
    {
        name:"Vendors",
        url: '/vendors',
        icon: <svg className="fill-gray-500 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 356.526 356.526"><path d="m218.255 113.943 29.936-39.527c2.168-2.864 1.855-7.075-.716-9.587L183.992 2.82C182.659 1.519 180.183 0 177.588 0c-2.624 0-5.105 1.554-6.432 2.884l-62.169 62.309c-2.536 2.541-2.841 6.636-.71 9.525l29.147 39.525c-48.697 16.945-83.745 63.304-83.745 117.701 0 68.695 55.888 124.583 124.584 124.583s124.584-55.888 124.584-124.583c0-54.715-35.453-101.303-84.592-118.001zm-39.992 212.583c-52.154 0-94.584-42.43-94.584-94.583 0-52.154 42.43-94.584 94.584-94.584s94.584 42.43 94.584 94.584c0 52.153-42.43 94.583-94.584 94.583z"/></svg>
    },
    {
        name:"Ideas",
        url: '/blog',
        icon: <svg className="fill-gray-500 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 356.526 356.526"><path d="m218.255 113.943 29.936-39.527c2.168-2.864 1.855-7.075-.716-9.587L183.992 2.82C182.659 1.519 180.183 0 177.588 0c-2.624 0-5.105 1.554-6.432 2.884l-62.169 62.309c-2.536 2.541-2.841 6.636-.71 9.525l29.147 39.525c-48.697 16.945-83.745 63.304-83.745 117.701 0 68.695 55.888 124.583 124.584 124.583s124.584-55.888 124.584-124.583c0-54.715-35.453-101.303-84.592-118.001zm-39.992 212.583c-52.154 0-94.584-42.43-94.584-94.583 0-52.154 42.43-94.584 94.584-94.584s94.584 42.43 94.584 94.584c0 52.153-42.43 94.583-94.584 94.583z"/></svg>
    },
    {
        name:"Bells Stories",
        url: '/stories',
        icon: <svg className="fill-gray-500 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 356.526 356.526"><path d="m218.255 113.943 29.936-39.527c2.168-2.864 1.855-7.075-.716-9.587L183.992 2.82C182.659 1.519 180.183 0 177.588 0c-2.624 0-5.105 1.554-6.432 2.884l-62.169 62.309c-2.536 2.541-2.841 6.636-.71 9.525l29.147 39.525c-48.697 16.945-83.745 63.304-83.745 117.701 0 68.695 55.888 124.583 124.584 124.583s124.584-55.888 124.584-124.583c0-54.715-35.453-101.303-84.592-118.001zm-39.992 212.583c-52.154 0-94.584-42.43-94.584-94.583 0-52.154 42.43-94.584 94.584-94.584s94.584 42.43 94.584 94.584c0 52.153-42.43 94.583-94.584 94.583z"/></svg>
    },
    {
        name:"Shop",
        url: '/shop',
        icon: <svg className="fill-gray-500 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 356.526 356.526"><path d="m218.255 113.943 29.936-39.527c2.168-2.864 1.855-7.075-.716-9.587L183.992 2.82C182.659 1.519 180.183 0 177.588 0c-2.624 0-5.105 1.554-6.432 2.884l-62.169 62.309c-2.536 2.541-2.841 6.636-.71 9.525l29.147 39.525c-48.697 16.945-83.745 63.304-83.745 117.701 0 68.695 55.888 124.583 124.584 124.583s124.584-55.888 124.584-124.583c0-54.715-35.453-101.303-84.592-118.001zm-39.992 212.583c-52.154 0-94.584-42.43-94.584-94.583 0-52.154 42.43-94.584 94.584-94.584s94.584 42.43 94.584 94.584c0 52.153-42.43 94.583-94.584 94.583z"/></svg>
    }
]

// mobile main menu
export const mobileMainMenu=[]

type DashMenuItem={
    name: "dashboard"|"vendors"|"registry"|"account"
    icon: JSX.Element
    url: string
    width?: string
    height?: string
}

// dashboard menu
export const mainDashMenu:DashMenuItem[]=[
    {
        name: "dashboard",
        icon: <svg className={`fill-gray-500 h-7 w-7`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 356.526 356.526"><path d="m218.255 113.943 29.936-39.527c2.168-2.864 1.855-7.075-.716-9.587L183.992 2.82C182.659 1.519 180.183 0 177.588 0c-2.624 0-5.105 1.554-6.432 2.884l-62.169 62.309c-2.536 2.541-2.841 6.636-.71 9.525l29.147 39.525c-48.697 16.945-83.745 63.304-83.745 117.701 0 68.695 55.888 124.583 124.584 124.583s124.584-55.888 124.584-124.583c0-54.715-35.453-101.303-84.592-118.001zm-39.992 212.583c-52.154 0-94.584-42.43-94.584-94.583 0-52.154 42.43-94.584 94.584-94.584s94.584 42.43 94.584 94.584c0 52.153-42.43 94.583-94.584 94.583z"/></svg>,
        url: "/dashboard",
    },
    {
        name: "vendors",
        icon: <svg className="fill-gray-500 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path d="M2 0 0 3c0 1.042.23 2 1.75 2S3.497 4 3.5 3l1.25-3H2zm4 0-.75 3c0 1.017.16 2 1.75 2s1.747-1.023 1.75-2L8 0H6zm3.25 0 1.25 3c0 1.023.324 2 1.75 2S14 3.983 14 3l-2-3H9.25zM1 6v8h12V6H1zm3 2h6c.565 0 1 .505 1 1v2H3V9c0-.542.505-1 1-1z"/></svg>,
        url: "/dashboard/vendormanager",
    },
    {
        name: "registry",
        icon: <svg className="fill-gray-500 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264.047 264.047"><path d="M229.048 146.136c-1.407-1.406-3.093-2.089-5.083-2.089h-79.942v120h72.421c8.283 0 14.579-7.108 14.579-15.392v-97.323c0-1.989-.568-3.789-1.975-5.196zM120.023 144.047H40.747c-4.143 0-7.724 3.144-7.724 7.286v97.322c0 8.283 6.962 15.392 15.245 15.392h71.755v-120zM120.023 66.047H48.38c-8.297 0-15.356 6.726-15.356 15.021v34.957c0 8.296 7.06 15.022 15.356 15.022h71.644v-65zM216.333 66.047h-72.31v65h72.31c8.297 0 14.69-6.726 14.69-15.022V81.068c0-8.296-6.393-15.021-14.69-15.021zM172.258 6.204C166.94 2.088 161.631 0 156.478 0c-10.301 0-18.388 7.643-24.104 22.73C126.658 7.643 118.572 0 108.271 0c-5.153 0-10.463 2.088-15.78 6.204-10.12 7.834-11.195 15.99-10.316 21.453 3.295 20.47 40.313 34.526 47.7 37.137a7.487 7.487 0 0 0 2.498.429h.002c.839 0 1.684-.141 2.498-.429 7.387-2.61 44.405-16.668 47.7-37.137.879-5.463-.196-13.618-10.315-21.453zm-56.803 35.642c-16.092-8.854-18.207-14.925-18.472-16.574-.338-2.11 1.239-4.535 4.689-7.206 2.591-2.006 4.872-3.066 6.599-3.066 3.209 0 8.097 5.118 12.193 19.483 1.099 3.852 1.953 7.736 2.605 11.222a132.99 132.99 0 0 1-7.614-3.859zm52.309-16.575c-1.042 6.497-13.751 14.669-26.14 20.505C144.563 30.401 150.249 15 156.478 15c1.727 0 4.008 1.06 6.598 3.066 3.449 2.67 5.027 5.094 4.688 7.205z"/></svg>,
        url: "/dashboard/registry",
    },
    {
        name: "account",
        icon: <svg className={`fill-gray-500 h-7 w-7 `} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 262.394 262.394"><path d="M245.63 103.39h-9.91a107.445 107.445 0 0 0-10.955-26.432l7.015-7.015c6.546-6.546 6.546-17.159 0-23.705l-15.621-15.621c-6.546-6.546-17.159-6.546-23.705 0l-7.015 7.015a107.484 107.484 0 0 0-26.432-10.955v-9.914C159.007 7.505 151.502 0 142.244 0h-22.091c-9.258 0-16.763 7.505-16.763 16.763v9.914a107.474 107.474 0 0 0-26.431 10.954l-7.016-7.015c-6.546-6.546-17.159-6.546-23.705.001l-15.62 15.621c-6.546 6.546-6.546 17.159 0 23.705l7.014 7.014a107.452 107.452 0 0 0-10.955 26.433h-9.914c-9.257 0-16.762 7.505-16.762 16.763v22.09c0 9.258 7.505 16.763 16.762 16.763h9.914a107.494 107.494 0 0 0 10.956 26.433l-7.015 7.015c-6.546 6.546-6.546 17.159 0 23.705l15.621 15.621c6.546 6.546 17.159 6.546 23.705 0l7.016-7.016a107.438 107.438 0 0 0 26.431 10.955v9.913c0 9.258 7.505 16.763 16.763 16.763h22.091c9.258 0 16.763-7.505 16.763-16.763v-9.913a107.487 107.487 0 0 0 26.432-10.956l7.016 7.017c6.546 6.546 17.159 6.546 23.705 0l15.621-15.621a16.762 16.762 0 0 0 0-23.706l-7.016-7.016a107.484 107.484 0 0 0 10.955-26.432h9.91c9.258 0 16.763-7.505 16.763-16.763v-22.09c-.001-9.257-7.506-16.762-16.764-16.762zm-114.432 87.804c-33.083 0-59.998-26.915-59.998-59.997 0-33.083 26.915-59.998 59.998-59.998s59.998 26.915 59.998 59.998c0 33.082-26.915 59.997-59.998 59.997z"/><path d="M131.198 101.199c-16.541 0-29.998 13.457-29.998 29.998 0 16.54 13.457 29.997 29.998 29.997s29.998-13.457 29.998-29.997c0-16.541-13.457-29.998-29.998-29.998z"/></svg>,
        url: "/dashboard/account",
    },
]

// dashboard categories menus
export const dashboardaccountmenu:MenuLink[]=[
    {
        name: "Information",
        url: "/dashboard/account/personal",
        icon: setIcon("information", "w-8", "h-8")
    },
    {
        name: "Reviews",
        url: "/dashboard/account/reviews",
        icon: setIcon("reviews", "w-8", "h-8")
    },
    {
        name: "Payment Details",
        url: "/dashboard/account/payment",
        icon: setIcon("payment details", "w-8", "h-8")
    },
    // {
    //     name: "Email Preferences",
    //     url: "/dashboard/account/preferences",
    //     icon: setIcon("email preferences", "w-8", "h-8")
    // }
]

export const dashboardregistrymenu:MenuLink[]=[
    {
        name: "Overview",
        url: "/dashboard/registry",
        icon: setIcon("overview", "w-8", "h-8")
    },
    {
        name: "Manage Registry",
        url: "/dashboard/registry/manage",
        icon: setIcon("manage registry", "w-8", "h-8")
    },
    {
        name: "Checklist",
        url: "/dashboard/registry/checklist",
        icon: setIcon("registry checklist", "w-8", "h-8")
    },
    {
        name: "Gift Tracker",
        url: "/dashboard/registry/gift-tracker",
        icon: setIcon("gift tracker", "w-8", "h-8")
    },
    {
        name: "Registry Settings",
        url: "/dashboard/registry/settings",
        icon: setIcon("registry settings", "w-8", "h-8")
    },
]

export const dashboardvendormenu:MenuLink[]=[
    {
        name: "Photography",
        url: "/dashboard/vendormanager/photography"
    },
    {
        name: "Venue",
        url: "/dashboard/vendormanager/venue"
    },
    {
        name: "Catering",
        url: "/dashboard/vendormanager/catering"
    },
    {
        name: "Decor",
        url: "/dashboard/vendormanager/decor"
    },
    {
        name: "Musician",
        url: "/dashboard/vendormanager/musician"
    },
    {
        name: "Dressing",
        url: "/dashboard/vendormanager/dressing"
    },
    {
        name: "Salon",
        url: "/dashboard/vendormanager/salon"
    },
    {
        name: "Transportation",
        url: "/dashboard/vendormanager/transportation"
    },
    {
        name: "MC",
        url: "/dashboard/vendormanager/mc"
    },
    {
        name: "Ushers",
        url: "/dashboard/vendormanager/ushers"
    },
    {
        name: "DJ",
        url: "/dashboard/vendormanager/dj"
    },
    {
        name: "Cake",
        url: "/dashboard/vendormanager/cake"
    },
];

export const mainvendormenu:MenuLink[]=[
    {
        name: "Photography",
        url: "/vendors/photography",
        icon: setIcon('photography', "w-8", "h-8")
    },
    {
        name: "Venue",
        url: "/vendors/venue",
        icon: setIcon('venue', "w-8", "h-8")
    },
    {
        name: "Catering",
        url: "/vendors/catering",
        icon: setIcon('catering', "w-8", "h-8")
    },
    {
        name: "Decor",
        url: "/vendors/decor",
        icon: setIcon('decor', "w-8", "h-8")
    },
    {
        name: "Musician",
        url: "/vendors/musician",
        icon: setIcon('musician', "w-8", "h-8")
    },
    {
        name: "Dressing",
        url: "/vendors/dressing",
        icon: setIcon('dressing', "w-8", "h-8")
    },
    {
        name: "Salon",
        url: "/vendors/salon",
        icon: setIcon('salon', "w-8", "h-8")
    },
    {
        name: "Transportation",
        url: "/vendors/transportation",
        icon: setIcon('transportation', "w-8", "h-8")
    },
    {
        name: "MC",
        url: "/vendors/mc",
        icon: setIcon('mc', "w-8", "h-8")
    },
    {
        name: "Ushers",
        url: "/dashboard/vendormanager/ushers",
        icon: setIcon('ushers', "w-8", "h-8")

    },
    {
        name: "DJ",
        url: "/vendors/dj",
        icon: setIcon('dj', "w-8", "h-8")
    },
    {
        name: "Cake",
        url: "/vendors/cake",
        icon: setIcon('cake', "w-8", "h-8")
    },
];

export const dashmenucategories:MenuLink[]=[
    {
        name: "Photography",
        url: "/dashboard/vendormanager/photography",
        icon: setIcon('photography', "w-8", "h-8")
    },
    {
        name: "Venue",
        url: "/dashboard/vendormanager/venue",
        icon: setIcon('venue', "w-8", "h-8")
    },
    {
        name: "Catering",
        url: "/dashboard/vendormanager/catering",
        icon: setIcon('catering', "w-8", "h-8")
    },
    {
        name: "Decor",
        url: "/dashboard/vendormanager/decor",
        icon: setIcon('decor', "w-8", "h-8")
    },
    {
        name: "Musician",
        url: "/dashboard/vendormanager/musician",
        icon: setIcon('musician', "w-8", "h-8")
    },
    {
        name: "Dressing",
        url: "/dashboard/vendormanager/dressing",
        icon: setIcon('dressing', "w-8", "h-8")
    },
    {
        name: "Salon",
        url: "/dashboard/vendormanager/salon",
        icon: setIcon('salon', "w-8", "h-8")
    },
    {
        name: "Transportation",
        url: "/dashboard/vendormanager/transportation",
        icon: setIcon('transportation', "w-8", "h-8")
    },
    {
        name: "MC",
        url: "/dashboard/vendormanager/mc",
        icon: setIcon('mc', "w-8", "h-8")
    },
    {
        name: "Ushers",
        url: "/dashboard/vendormanager/ushers",
        icon: setIcon('ushers', "w-8", "h-8")

    },
    {
        name: "DJ",
        url: "/dashboard/vendormanager/dj",
        icon: setIcon('dj', "w-8", "h-8")
    },
    {
        name: "Cake",
        url: "/dashboard/vendormanager/cake",
        icon: setIcon('cake', "w-8", "h-8")
    },
];

export const registrystoremenu:MenuLink[]=
[
    {
        name: "Electronics",
        url: "/store/electronics"
    },
    {
        name: "Dining Essentials",
        url: "/store/dining-essentials"
    },
    {
        name: "Cleaning",
        url: "/store/cleaning"
    },
    {
        name: "Bedroom Essentials",
        url: "/store/bedroom-essentials"
    },
    {
        name: "Bathroom Essentials",
        url: "/store/bathroom-essentials"
    },   
    {
        name: "Drinkware",
        url: "/store/drinkware"
    }, 
    {
        name: "Home Decor",
        url: "/store/home-decor"
    },
    {
        name: "Kitchen Appliances",
        url: "/store/kitchen-appliances"
    },
    {
        name: "Kitchen Essentials",
        url: "/store/kitchen-essentials"
    },
];

// footer links
export const footerLinks:MenuLink[]=[
    {
        name: "About Us",
        url: "/about",
    },
    {
        name: "Shop",
        url: "/shop",
    },
    {
        name: "Destination Weddings",
        url: "/destination-weddings",
    },
    {
        name: "Honeymoon",
        url: "/honeymoon",
    },
    {
        name: "Advertising",
        url: "/advertising",
    },
    {
        name: "Help",
        url: "/help",
    },
];

// footer other links
export const footerOtherLinks:MenuLink[]=[
    {
        name: "Privacy",
        url: "/privacy",
    },
    {
        name: "Cookie Policy",
        url: "/dashboard/cookies",
    },
    {
        name: "Terms of Use",
        url: "/dashboard/terms-and-conditions",
    },
];

// footer other links
export const footerVendorLinks:MenuLink[]=[
    {
        name: "Register",
        url: "/vendor-register",
    },
    {
        name: "Support",
        url: "/vendor-support",
    }
];

// dashboard categories menus
export const vendordashboardmenu:MenuLink[]=[
    {
        name: "Overview",
        url: "/bellsvendor/dashboard"
    },
    {
        name: "Your Information",
        url: "/bellsvendor/dashboard/your-info"
    },
    {
        name: "Your Images",
        url: "/bellsvendor/dashboard/your-images"
    },
    {
        name: "Analytics",
        url: "/bellsvendor/dashboard/analytics"
    },
    {
        name: "Advertising",
        url: "/bellsvendor/dashboard/ads"
    }
];


