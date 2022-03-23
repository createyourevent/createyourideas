import { Injectable } from '@angular/core';
import { IIdea } from 'app/entities/idea/idea.model';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {

public idea: IIdea;

constructor() { }

}
