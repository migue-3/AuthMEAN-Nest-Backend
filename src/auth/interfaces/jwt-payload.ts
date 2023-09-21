//Esta es la data que guardamos en el JWT

export interface JwtPayload {
    id: string;
    iat?: number;
    exp?: number;
}