export interface Usuario {
    id?: number;
    nome: string;
    email: string;
    senha?: string; 
    cargo?: 'admin' | 'cozinheiro';
}