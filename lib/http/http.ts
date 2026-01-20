import { NextResponse } from 'next/server';

   
                                      
                                                                        
   
export function ok<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json(
    { data },
    typeof init === 'number' ? { status: init } : init
  );
}

   
                                        
                                                                
                                                                     
   
export const created = <T>(data: T, location?: string) => {
  const res = NextResponse.json({ data }, { status: 201 });
  if (location) res.headers.set('Location', location);
  return res;
};

   
                                              
                                                                                  
   
export function noContent() {
  return new NextResponse(null, { status: 204 });
}

   
                                                 
                                                                                 
                                         
   
export function badRequest(message = 'Bad Request', details?: unknown) {
  return NextResponse.json({ message, details }, { status: 400 });
}

   
                                                                      
                                                            
   
export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401 });
}

   
                                         
                                                                                    
   
export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ message }, { status: 403 });
}

   
                                     
                                                                                  
   
export function notFound(message = 'Not Found') {
  return NextResponse.json({ message }, { status: 404 });
}

   
                                       
                                                                                  
   
export function conflict(message = 'Conflict', code?: string) {
  return NextResponse.json({ code, message }, { status: 409 });
}

   
                                                                     
                                                                    
   
export function unprocessable(
  message = 'Validation failed',
  details?: unknown
) {
  return NextResponse.json({ message, details }, { status: 422 });
}

   
                                                    
                                                                     
   
export function tooManyRequests(message = 'Too Many Requests') {
  return NextResponse.json({ message }, { status: 429 });
}

   
                                                          
                                                                                
   
export function serverError(
  message = 'Internal Server Error',
  details?: unknown
) {
  return NextResponse.json({ message, details }, { status: 500 });
}

   
                                                   
                              
   
export function notImplemented(message = 'Not Implemented') {
  return NextResponse.json({ message }, { status: 501 });
}

   
                                                                        
                                                                             
   
export function methodNotAllowed(allowed: string[]) {
  const res = NextResponse.json(
    { message: `Method not allowed. Use: ${allowed.join(', ')}` },
    { status: 405 }
  );
  res.headers.set('Allow', allowed.join(', '));
  return res;
}

export const fail = (reason: 'invalid' | 'expired' | 'server', url?: URL) =>
  NextResponse.redirect(
    new URL(`/auth/verify/fail?reason=${reason}`, url),
    302
  );
