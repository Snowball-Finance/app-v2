

const getUserBoost = (totalSnowcone,totalLP,userDepositedLP,snowconeUser) => {
    const DB = userDepositedLP * 0.4;
    const AB = ((totalLP * snowconeUser) / totalSnowcone) * 0.6;
    const Boost = Math.min(DB + AB, userDepositedLP) / DB;
    
    return Boost;
}

export default getUserBoost;