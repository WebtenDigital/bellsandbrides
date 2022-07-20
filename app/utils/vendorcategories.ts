export const vendorCategories=["Cake", "Catering", "Decor", "DJ", "Dressing", "MC", "Musician", "Photography", "Salon", "Transportation", "Ushers", "Venue"];

export function vendorPriceTiers(category:string){
    switch(category.toLowerCase()){
        case 'cake':
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K+'];
        case 'catering':
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K - UGX 1M', 'UGX 1M+'];
        case 'decor':
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K - UGX 1M', 'UGX 1M+'];
        case 'dj':
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K - UGX 1M', 'UGX 1M+'];
        case 'dressing':
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K - UGX 1M', 'UGX 1M+'];
        case 'mc':
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K - UGX 1M', 'UGX 1M+'];
        case 'musician':
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K - UGX 1M', 'UGX 1M+'];
        case 'photography':
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K - UGX 1M', 'UGX 1M+'];
        case 'salon':
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K - UGX 1M', 'UGX 1M+'];
        case 'transportation':
            return ['under UGX 1M', 'UGX 1M - UGX 2M', 'UGX 2M+'];
        default:
            return ['under UGX 200K', 'UGX 200K - UGX 500K', 'UGX 500K - UGX 1M', 'UGX 1M+'];
    }
}