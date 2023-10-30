const { banco, contas } = require( "../bancodedados" );

const validarCamposObrigatorios = ( req, res, next ) => {
    const { cpf, email } = req.body

    const encontrarEmail = ( email ) => {
        return contas.some( ( conta ) => {
            return conta.usuario.email === email
        } );
    }

    if ( encontrarEmail( email ) ) {
        return res.status( 400 ).json( { mensagem: 'Este email já está cadastrado' } );
    }

    const encontrarCpf = ( cpf ) => {
        return contas.some( ( conta ) => {
            return conta.usuario.cpf === cpf;
        } );
    }

    if ( encontrarCpf( cpf ) ) {
        return res.status( 400 ).json( { mensagem: 'Este CPF já está cadastrado' } );
    }

    let cpfFormatado = cpf.replace( /[^a-zA-Z0-9]/g, '' )

    if ( !/^\d{11}$/.test( cpfFormatado ) ) {
        return res.status( 400 ).json( { mensagem: 'CPF inválido' } )
    }
    const digitos = cpfFormatado.split( '' ).map( Number )
    let soma = digitos.reduce( ( acc, valorAtual, idx ) => {
        if ( idx < 9 ) {
            return acc + valorAtual * ( 10 - idx );
        }
        return acc;
    }, 0 );

    let resto = ( soma * 10 ) % 11;

    if ( resto === 10 || resto === 11 ) {
        resto = 0;
    }

    if ( resto !== digitos[ 9 ] ) {
        return res.status( 400 ).json( { mensagem: 'CPF inválido' } )
    }

    soma = digitos.reduce( ( acc, valorAtual, idx ) => {
        if ( idx < 10 ) {
            return acc + valorAtual * ( 11 - idx );
        }
        return acc;
    }, 0 );

    resto = ( soma * 10 ) % 11;

    if ( resto === 10 || resto === 11 ) {
        resto = 0;
    }

    if ( resto !== digitos[ 10 ] ) {
        return res.status( 400 ).json( { mensagem: 'CPF inválido' } )
    }

    next()
}


const senhaDoBanco = ( req, res, next ) => {
    const { senha_banco } = req.query;

    if ( !senha_banco ) {
        return res.status( 400 ).json( { mensagem: 'É preciso informar a senha' } )
    }
    else if ( senha_banco !== banco.senha ) {
        return res.status( 400 ).json( { mensagem: 'A Senha está incorreta' } )
    }

    next();
}

module.exports = {
    validarCamposObrigatorios,
    senhaDoBanco
}
