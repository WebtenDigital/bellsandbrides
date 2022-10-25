import { createCookieSessionStorage } from "@remix-run/node";

const secret=process.env.SESSION_SECRET;
if(!secret){
    throw new Error('SESSION_SECRET not set');
}

export const storage=createCookieSessionStorage({
    cookie: {
        name: "__session",
        // all of these are optional
        // domain: "remix.run",
        // expires: new Date('2029-01-01'), //this is for the cookie, not the session dummy
        httpOnly: true,
        // maxAge: 60,
        path: "/",
        sameSite: "lax",
        secrets: [secret],
        secure: true,
      },
});

export const adminsessionstorage=createCookieSessionStorage({
    cookie: {
        name: "__admin_session",
        // all of these are optional
        // domain: "remix.run",
        // expires: new Date('2029-01-01'), //this is for the cookie, not the session dummy
        httpOnly: true,
        // maxAge: 60,
        path: "/",
        sameSite: "lax",
        secrets: [process.env.ADMIN_PASSWORD?process.env.ADMIN_PASSWORD:"admin_secret1"],
        secure: true,
    }
});

export const vendorsessionstorage=createCookieSessionStorage({
    cookie: {
        name: "__vendor_session",
        // all of these are optional
        // domain: "remix.run",
        // expires: new Date('2029-01-01'), //this is for the cookie, not the session dummy
        httpOnly: true,
        // maxAge: 60,
        path: "/",
        sameSite: "lax",
        secrets: [process.env.VENDOR_SECRET?process.env.VENDOR_SECRET:"vendor_secret1"],
        secure: true,
    }
});