'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [query, setQuery] = useState('');

  // Sync input with URL
  useEffect(() => {
    setQuery(searchParams.get('s') ?? '');
  }, [searchParams]);

  function handleSearch(e) {
    e.preventDefault();

    if (!query.trim()) return;

    const params = new URLSearchParams(searchParams);
    params.set('s', query);

    replace(`/search?${params.toString()}`);
  }

  return <>
			<form className="input-group" action="/search" method="get" onSubmit={(e)=> handleSearch(e)}>
				<div id="search-container">
					<input 
						type="search" 
						id="search" 
						name="s" 
						className="form-control" 
						defaultValue={query} 
						placeholder="Search stations, news, podcast" 
						autoComplete="off"
						onChange={(e) => setQuery(e.target.value)}
						/>
					<button className="" type="submit" id="button-addon2">
						<img src="/images/search_icon.svg" className="" />
					</button>
				</div>
			</form>
		</>;
}
