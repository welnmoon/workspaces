import { NextResponse } from 'next/server';

export function ok<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json(
    data,
    typeof init === 'number' ? { status: init } : init
  );
} // ResponceInit - описывает объект вида:
// { status: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' } }
export function badRequest(message = 'Bad Request') {
  return NextResponse.json({ message }, { status: 400 });
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401 });
}

export function forbidden(message = 'Forbidden') {
  // forbibben - это о недостатке прав
  return NextResponse.json({ message }, { status: 403 });
}
