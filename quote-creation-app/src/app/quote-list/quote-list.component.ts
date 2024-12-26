import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../services/quote.service';
import { Quote } from '../models/Quote';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.css'],
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = []; 
  searchQuery = '';
  currentPage = 1;
  pageSize = 10; 
  totalPages: number = 1; 
  totalQuotes: number = 0; 

  constructor(private quoteService: QuoteService) {}

  ngOnInit() {
    this.getQuotes();
  }

  getQuotes() {
    this.quoteService.getQuotes(this.currentPage, this.pageSize, this.searchQuery).subscribe((data) => {
      this.quotes = data.quotes; 
      this.totalQuotes = data.totalQuotes; 
      this.totalPages = Math.ceil(this.totalQuotes / this.pageSize); 
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.getQuotes();
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getQuotes();
  }
}
