export declare function createWorkspaceProfile(config: any, state: any): {
    client: any;
    chapter: any;
    lead: any;
    approvedCriteria: any;
    readyCriteria: any;
    blockedCriteria: any;
    evidenceCount: any;
    completedActions: any;
    completionRate: number;
    updatedAt: any;
};
export declare function createSaasMetrics(config: any, state: any, scoreResult: any, warnings?: any[]): {
    profile: {
        client: any;
        chapter: any;
        lead: any;
        approvedCriteria: any;
        readyCriteria: any;
        blockedCriteria: any;
        evidenceCount: any;
        completedActions: any;
        completionRate: number;
        updatedAt: any;
    };
    kpis: {
        label: string;
        value: number;
        suffix: string;
        detail: any;
    }[];
    risk: string;
    segments: {
        name: string;
        need: string;
        package: string;
        successMetric: any;
    }[];
    experiments: {
        title: string;
        hypothesis: string;
        metric: string;
        owner: any;
    }[];
    board: {
        stage: string;
        playbook: string;
        health: string;
    }[];
    milestones: {
        window: string;
        outcome: string;
        evidence: string;
    }[];
    automations: {
        name: string;
        trigger: string;
        action: string;
    }[];
    pricing: {
        tier: string;
        audience: any;
        promise: string;
        price: string;
    }[];
    governance: {
        name: string;
        status: string;
        detail: string;
    }[];
    personas: {
        role: any;
        job: string;
        permission: string;
        valueMoment: string;
    }[];
    journeys: {
        phase: string;
        promise: string;
        activation: string;
        churnRisk: string;
    }[];
    featurePackaging: {
        feature: string;
        tier: string;
        value: string;
    }[];
    revenueModel: {
        lever: string;
        assumption: string;
        kpi: string;
        guardrail: string;
    }[];
    analyticsPlan: {
        event: string;
        question: string;
        action: string;
    }[];
    securityModel: {
        control: string;
        policy: string;
        evidence: string;
    }[];
    successPlaybooks: {
        name: string;
        trigger: string;
        response: string;
        success: string;
    }[];
    integrations: {
        name: string;
        direction: string;
        value: string;
        privacy: string;
    }[];
    expansionRoadmap: {
        horizon: string;
        release: string;
        unlock: string;
        proof: string;
    }[];
    investorBrief: {
        topic: string;
        message: string;
    }[];
};
export declare function buildSaasMarkdown(config: any, state: any, scoreResult: any, warnings?: any[]): string;
