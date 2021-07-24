

const getUserBoost = (totalSnowcone,totalLP,userLP,snowconeUser) => {
    const DB = userLP * 0.4;
    const AB = ((totalLP * snowconeUser) / totalSnowcone) * 0.6;
    const Boost = Math.min(DB + AB, userLP) / DB;
    
    return Boost;
}

export default getUserBoost;