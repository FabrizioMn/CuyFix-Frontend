import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBoardPage } from './project-board.page';

describe('ProjectBoardPage', () => {
  let component: ProjectBoardPage;
  let fixture: ComponentFixture<ProjectBoardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectBoardPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectBoardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
