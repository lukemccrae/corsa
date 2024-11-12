import * as React from 'react';

const articles = [{name: "name", writing: "writing"}]


export const Articles = () => {
    return (articles.map(a => 
       <div>
        <h1>{a.name}</h1>
        <p>{a.writing}</p>
       </div> 
    ))
}