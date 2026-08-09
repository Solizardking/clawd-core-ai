/**
 * Zod schemas for permission updates.
 *
 * This file is intentionally kept minimal with no complex dependencies
 * so it can be safely imported by src/types/hooks.ts without creating
 * circular dependencies.
 */
import z from 'zod/v4';
import type { PermissionUpdate, PermissionUpdateDestination } from '../../types/permissions.js';
export type { PermissionUpdate, PermissionUpdateDestination };
/**
 * PermissionUpdateDestination is where a new permission rule should be saved to.
 */
export declare const permissionUpdateDestinationSchema: () => z.ZodEnum<{
    session: "session";
    userSettings: "userSettings";
    projectSettings: "projectSettings";
    localSettings: "localSettings";
    cliArg: "cliArg";
}>;
export declare const permissionUpdateSchema: () => z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"addRules">;
    rules: z.ZodArray<z.ZodObject<{
        toolName: z.ZodString;
        ruleContent: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    behavior: z.ZodEnum<{
        allow: "allow";
        deny: "deny";
        ask: "ask";
    }>;
    destination: z.ZodEnum<{
        session: "session";
        userSettings: "userSettings";
        projectSettings: "projectSettings";
        localSettings: "localSettings";
        cliArg: "cliArg";
    }>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"replaceRules">;
    rules: z.ZodArray<z.ZodObject<{
        toolName: z.ZodString;
        ruleContent: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    behavior: z.ZodEnum<{
        allow: "allow";
        deny: "deny";
        ask: "ask";
    }>;
    destination: z.ZodEnum<{
        session: "session";
        userSettings: "userSettings";
        projectSettings: "projectSettings";
        localSettings: "localSettings";
        cliArg: "cliArg";
    }>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"removeRules">;
    rules: z.ZodArray<z.ZodObject<{
        toolName: z.ZodString;
        ruleContent: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    behavior: z.ZodEnum<{
        allow: "allow";
        deny: "deny";
        ask: "ask";
    }>;
    destination: z.ZodEnum<{
        session: "session";
        userSettings: "userSettings";
        projectSettings: "projectSettings";
        localSettings: "localSettings";
        cliArg: "cliArg";
    }>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"setMode">;
    mode: z.ZodEnum<{
        default: "default";
        plan: "plan";
        acceptEdits: "acceptEdits";
        bypassPermissions: "bypassPermissions";
        dontAsk: "dontAsk";
    }>;
    destination: z.ZodEnum<{
        session: "session";
        userSettings: "userSettings";
        projectSettings: "projectSettings";
        localSettings: "localSettings";
        cliArg: "cliArg";
    }>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"addDirectories">;
    directories: z.ZodArray<z.ZodString>;
    destination: z.ZodEnum<{
        session: "session";
        userSettings: "userSettings";
        projectSettings: "projectSettings";
        localSettings: "localSettings";
        cliArg: "cliArg";
    }>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"removeDirectories">;
    directories: z.ZodArray<z.ZodString>;
    destination: z.ZodEnum<{
        session: "session";
        userSettings: "userSettings";
        projectSettings: "projectSettings";
        localSettings: "localSettings";
        cliArg: "cliArg";
    }>;
}, z.core.$strip>], "type">;
//# sourceMappingURL=PermissionUpdateSchema.d.ts.map