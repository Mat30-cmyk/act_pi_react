import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Service key SOLO en backend
);

export async function POST(req: Request) {
  try {
    const { username, password, confirmPassword, firstName, lastName } =
      await req.json();

    if (!username || !password || !confirmPassword) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 });
    }

    // usamos un email "falso" basado en el username
    const fakeEmail = `${username}@fake.com`;

    // crear usuario en supabase auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: fakeEmail,
      password,
      email_confirm: true, // lo confirmamos automáticamente
      user_metadata: {
        username,
        firstName,
        lastName,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // insertar en tabla propia de usuarios
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: data.user?.id,
        username,
        first_name: firstName,
        last_name: lastName,
      },
    ]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}