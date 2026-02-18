<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HostDashboardController extends Controller
{
    /**
     * Display the host dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('feats/host/host-dashboard');
    }
}
