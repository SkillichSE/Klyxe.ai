from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Response, Request
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db import get_db
from app.models import User
from app.schemas import UserOut

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(401, "Invalid token")
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(401, "User not found")
    return user


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/magic-link")
def request_magic_link(email: str):
    # Placeholder: in production this sends email with signed token URL.
    return {"status": "ok", "email": email}


@router.post("/callback", response_model=UserOut)
def auth_callback(email: str, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    exp = datetime.utcnow() + timedelta(minutes=settings.access_token_minutes)
    token = jwt.encode({"sub": str(user.id), "exp": exp}, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    response.set_cookie("access_token", token, httponly=True, samesite="lax")
    return UserOut(id=user.id, email=user.email, created_at=user.created_at)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"status": "ok"}
