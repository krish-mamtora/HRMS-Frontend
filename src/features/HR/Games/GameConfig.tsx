import React from 'react';
import useGame from '../hooks/useGame';
import useGameConfig from '../hooks/useGameConfig'; 
import type Game from '../hooks/useGame'; 


const GameConfig = () => {
    const { data, isLoading, isError, error } = useGame();
    console.log(data);
    if (isLoading) return <div>Loading games...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <div>
            <h1>Game Configuration</h1>
              <div className="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                <table id="search-table" className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="bg-neutral-secondary-soft border-b border-default">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                              <th className="px-6 py-3 font-medium">Location</th>
                            <th className="px-6 py-3 font-medium">isAvailable </th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => (
                            <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                                <td className="px-6 py-4">{item.name}</td>
                                <td className="px-6 py-4">{item.location}</td>
                                <td className="px-6 py-4">{item.isAvailable?"Yes":"No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GameConfig;
