/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Utensils, Plus, Trash2, CheckCircle, HelpCircle } from "lucide-react";
import { Meal } from "../types";

export default function Nutrition() {
  const [meals, setMeals] = useState<Meal[]>([
    { id: "1", type: "Breakfast", name: "High-protein Oatmeal with Chia seeds & Berries", calories: 380, protein: 18, carbs: 45 },
    { id: "2", type: "Lunch", name: "Grilled Salmon over Spinach and Quinoa Bowl", calories: 540, protein: 42, carbs: 30 },
    { id: "3", type: "Dinner", name: "Baked Turkey breast with Steamed Asparagus", calories: 420, protein: 38, carbs: 12 },
  ]);

  const [newType, setNewType] = useState<"Breakfast" | "Lunch" | "Dinner" | "Snack">("Breakfast");
  const [newName, setNewName] = useState("");
  const [newCals, setNewCals] = useState("350");
  const [newProt, setNewProt] = useState("20");

  const [shoppingList, setShoppingList] = useState<Array<{ item: string; done: boolean }>>([
    { item: "Organic Salmon fillets (Wild-caught)", done: false },
    { item: "Organic Baby Spinach leaves", done: true },
    { item: "Quinoa grain pack", done: false },
    { item: "Unsweetened Almond Milk", done: false },
  ]);
  const [newShopItem, setNewShopItem] = useState("");

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setMeals((prev) => [
      ...prev,
      {
        id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: newType,
        name: newName.trim(),
        calories: parseInt(newCals),
        protein: parseInt(newProt),
        carbs: 25, // Mock default carb value
      },
    ]);
    setNewName("");
  };

  const handleDeleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddShopItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopItem.trim()) return;
    setShoppingList((prev) => [...prev, { item: newShopItem.trim(), done: false }]);
    setNewShopItem("");
  };

  const handleToggleShopItem = (index: number) => {
    setShoppingList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, done: !item.done } : item))
    );
  };

  const handleDeleteShopItem = (index: number) => {
    setShoppingList((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Compute totals
  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.protein, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Nutrition & Meal Planner
        </h1>
        <p className="text-sm text-[#c3c6d7]/60 font-light mt-1">
          Evidence-based cardiovascular diet schedules, personalized macro calculations, and synchronized grocery logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MEALS LIST (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Daily Meal Schedule</h3>
              <p className="text-xs text-[#c3c6d7]/50 font-light">Target standard: 1800 kcal • 110g protein</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-400 font-bold font-mono">
                {totalCalories} kcal / {totalProtein}g protein logged
              </span>
            </div>
          </div>

          <form onSubmit={handleAddMeal} className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#020617]/50 border border-white/5 rounded-2xl p-4">
            <div className="col-span-2 space-y-1">
              <label className="text-[9px] uppercase font-bold text-[#c3c6d7]/40">Meal Item Name</label>
              <input
                type="text"
                placeholder="Protein Shake, Eggs..."
                className="w-full p-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-[#c3c6d7]/40">Category</label>
              <select
                className="w-full p-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <button type="submit" className="py-2 mt-4.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer">
              Add Item
            </button>
          </form>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {meals.map((m) => (
              <div key={m.id} className="flex justify-between items-center p-3.5 rounded-2xl bg-[#020617]/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-blue-400">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <p className="text-[10px] text-[#c3c6d7]/50 font-light">
                      {m.type} • <span className="text-cyan-400 font-medium">{m.calories} kcal</span> • {m.protein}g Protein
                    </p>
                  </div>
                </div>

                <button onClick={() => handleDeleteMeal(m.id)} className="p-1 rounded-lg text-[#c3c6d7]/30 hover:text-red-400 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SHOPPING LIST (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Synchronized Grocery List</h3>

          <form onSubmit={handleAddShopItem} className="flex gap-2">
            <input
              type="text"
              placeholder="Add healthy grocery item..."
              className="flex-1 p-2 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              value={newShopItem}
              onChange={(e) => setNewShopItem(e.target.value)}
            />
            <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer">
              Add
            </button>
          </form>

          <div className="space-y-2">
            {shoppingList.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2.5 rounded-xl border transition-all ${
                  item.done
                    ? "bg-blue-950/20 border-blue-500/10 opacity-60"
                    : "bg-[#020617]/50 border-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggleShopItem(index)}
                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                      item.done
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                  <span className={`text-xs ${item.done ? "line-through text-white/40" : "text-white"}`}>
                    {item.item}
                  </span>
                </div>

                <button onClick={() => handleDeleteShopItem(index)} className="text-[#c3c6d7]/30 hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
