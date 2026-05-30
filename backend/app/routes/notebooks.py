from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Notebook, User
from app.schemas import NotebookCreate, NotebookOut
from app.routes.auth import get_current_user

router = APIRouter(prefix="/notebooks", tags=["notebooks"])


@router.get("", response_model=list[NotebookOut])
def list_notebooks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = db.query(Notebook).filter(Notebook.user_id == current_user.id).order_by(Notebook.updated_at.desc()).all()
    return [NotebookOut(id=n.id, title=n.title, created_at=n.created_at, updated_at=n.updated_at) for n in rows]


@router.post("", response_model=NotebookOut)
def create_notebook(payload: NotebookCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notebook = Notebook(user_id=current_user.id, title=payload.title)
    db.add(notebook)
    db.commit()
    db.refresh(notebook)
    return NotebookOut(
        id=notebook.id,
        title=notebook.title,
        created_at=notebook.created_at,
        updated_at=notebook.updated_at,
    )
