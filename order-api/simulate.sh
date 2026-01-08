#!/bin/bash

# Configuration
API_URL="http://localhost:3000/order"
PIZZAS=("pepperoni" "margherita" "hawaiian" "veggie" "meat-lovers" "bbq-chicken")
TOTAL_ORDERS=20

echo "🍕 WELCOME TO PIZZA BLITZ SIMULATOR 🍕"
echo "-------------------------------------"
echo "Simulating $TOTAL_ORDERS incoming orders..."
echo ""

for ((i=1; i<=TOTAL_ORDERS; i++))
do
   # 1. Pick a random pizza from the array
   RANDOM_INDEX=$(($RANDOM % ${#PIZZAS[@]}))
   CHOSEN_PIZZA=${PIZZAS[$RANDOM_INDEX]}

   # 2. Send the request to the API
   # -s: Silent mode (hides progress bar)
   RESPONSE=$(curl -s "$API_URL/$CHOSEN_PIZZA")

   # 3. Print a nice output
   echo "[$i/$TOTAL_ORDERS] Ordered $CHOSEN_PIZZA"
   echo "   ↳ API Response: $RESPONSE"
   
   # Optional: Sleep very briefly (0.1s) to make it readable, 
   # or remove to see true "Queue buildup"
   sleep 0.1
done

echo ""
echo "-------------------------------------"
echo "✅ Simulation finished!"
echo "👉 Check your 'Kitchen Worker' terminal to see them cooking!"