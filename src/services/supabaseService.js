// src/services/supabaseService.js
import { supabase } from '../lib/supabaseClient';

const TABLE_MAP = {
    settings: 'user_settings',
    transactions: 'transactions',
    financialProducts: 'financial_products',
    debts: 'debts',
    budgets: 'budgets',
    goals: 'goals'
};

const SUPABASE_ID_MAP = {
    settings: 'user_id',
    transactions: 'id',
    financialProducts: 'id',
    debts: 'id',
    budgets: 'id',
    goals: 'id'
};

const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    return user.id;
};

// Fetch data for all categories for a given user
export const fetchAllUserData = async (userId) => {
    const dataPromises = Object.keys(TABLE_MAP).map(async (key) => {
        const { data, error } = await supabase
            .from(TABLE_MAP[key])
            .select('id, data, last_updated')
            .eq('user_id', userId);

        if (error) {
            console.error(`Error fetching ${key}:`, error);
            return { [key]: { records: [], last_updated: null } };
        }

        const formattedData = data.map(item => ({
            ...item.data,
            id: item.id,
            last_updated: item.last_updated
        }));

        let lastUpdated = null;
        if (data.length > 0) {
            lastUpdated = data.reduce((maxDate, item) => 
                (new Date(item.last_updated) > new Date(maxDate) ? item.last_updated : maxDate), data[0].last_updated);
        }

        return { [key]: { records: formattedData, last_updated: lastUpdated } };
    });

    const results = await Promise.all(dataPromises);
    
    return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};

// Save a single item to a specific table
export const saveItem = async (tableKey, item) => {
    try {
        const userId = await getUserId();
        const { id, last_updated, ...restOfData } = item;

        const { data, error } = await supabase
            .from(TABLE_MAP[tableKey])
            .upsert({
                id: item.id,
                user_id: userId,
                data: restOfData,
                last_updated: new Date().toISOString()
            }, { onConflict: SUPABASE_ID_MAP[tableKey] });

        if (error) {
            console.error(`Error saving item to ${tableKey}:`, error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Save item error:', error);
        throw error;
    }
};

// Delete a single item from a specific table
export const deleteItem = async (tableKey, itemId) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_MAP[tableKey])
            .delete()
            .eq('id', itemId);

        if (error) {
            console.error(`Error deleting item from ${tableKey}:`, error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Delete item error:', error);
        throw error;
    }
};

// Get a single item by ID
export const getItem = async (tableKey, itemId) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_MAP[tableKey])
            .select('id, data, last_updated')
            .eq('id', itemId)
            .single();

        if (error) {
            console.error(`Error fetching item from ${tableKey}:`, error);
            throw error;
        }
        
        return {
            ...data.data,
            id: data.id,
            last_updated: data.last_updated
        };
    } catch (error) {
        console.error('Get item error:', error);
        throw error;
    }
};