import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';

@Injectable({
	providedIn: 'root',
})
export class HeroService {
	constructor(
		private http: HttpClient,
		private messageService: MessageService
	) {}

	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}

	private heroesUrl = 'api/heroes';

	getHeroes(): Observable<Hero[]> {
		this.messageService.add('HeroService: fetched heroes');
		return this.http.get<Hero[]>(this.heroesUrl).pipe(
			tap((_) => this.log('fetch heroes')),
			catchError(this.handleError<Hero[]>('getHeroes', []))
		);
	}

	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		this.messageService.add(`HeroService: fetched hero id=${id}`);
		return this.http.get<Hero>(url).pipe(
			tap((_) => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			this.log(`${operation} failed: ${error.message}`);
			return of(result as T);
		};
	}

	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
			tap((_) => this.log(`updated hero id=${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
		);
	}

	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
	};

	addHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
			tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
			catchError(this.handleError<Hero>('addHero'));
		);
	}
}
