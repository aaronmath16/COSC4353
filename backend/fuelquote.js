const base = 1
//Simple class, to be implemented in final assignment.
class FuelPricing{ 
    constructor(uid, gals, state, histExists){
        this.uid = uid
        this.gals = gals
        this.state = state
        this.histExists = histExists
        this.currentPrice = 1.50
        this.margin = 0.1
        
        if(gals > 1000){
            this.margin += 0.02
        }else{
            this.margin += 0.03
        }
        if(this.state == 'TX'){
            this.margin += 0.02
        }else{
            this.margin += 0.04
        }
        if(histExists){
            this.margin -= 0.01
        }
    }

    getPrice(){
        return this.currentPrice + (this.currentPrice*this.margin)
    }
}

module.exports = FuelPricing