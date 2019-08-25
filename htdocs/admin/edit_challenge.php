<?php

require('../../include/mellivora.inc.php');

enforce_authentication(CONST_USER_CLASS_MODERATOR);

validate_id($_GET['id']);

$challenge = db_select_one(
    'challenges',
    array('*'),
    array('id' => $_GET['id'])
);

if (empty($challenge)) {
    message_error('No challenge found with this ID');
}

head('Site management');
menu_management();

section_title ('Edit challenge: ' . $challenge['title']);
form_start(Config::get('MELLIVORA_CONFIG_SITE_ADMIN_RELPATH') . 'actions/edit_challenge');
$opts = db_query_fetch_all('SELECT * FROM categories ORDER BY title');

form_input_text('Title', $challenge['title']);
form_textarea('Description', $challenge['description']);
form_input_text('Flag', $challenge['flag']);
form_select($opts, 'Category', 'id', $challenge['category'], 'title');
form_input_checkbox('Exposed', $challenge['exposed']);

form_button_submit('Save changes');

section_subhead ("Advanced Settings:");
form_input_text('Initial Points', $challenge['initial_points']);
form_input_text('Minimum Points', $challenge['minimum_points']);
form_input_text('Solve Decay', $challenge['solve_decay']);

$opts = db_query_fetch_all('
    SELECT
       ch.id,
       ch.title,
       ca.title AS category
    FROM challenges AS ch
    LEFT JOIN categories AS ca ON ca.id = ch.category
    ORDER BY ca.title, ch.title'
);

array_unshift($opts, array('id'=>0, 'title'=> '-- No Challenge --'));
form_select($opts, 'Relies on', 'id', $challenge['relies_on'], 'title', 'category');

form_input_text('Available from', date_time($challenge['available_from']));
form_input_text('Available until', date_time($challenge['available_until']));

form_input_checkbox('Automark', $challenge['automark']);
form_input_checkbox('Case insensitive', $challenge['case_insensitive']);
form_input_text('Num attempts allowed', $challenge['num_attempts_allowed']);
form_input_text('Min seconds between submissions', $challenge['min_seconds_between_submissions']);

form_hidden('action', 'edit');
form_hidden('id', $_GET['id']);

form_button_submit('Save changes');
form_end();

section_small_dropdown ('Hints');
echo '
<table id="hints" class="table table-striped table-hover">
<thead>
  <tr>
    <th>Added</th>
    <th>Hint</th>
    <th>Manage</th>
  </tr>
</thead>
<tbody>
';

$hints = db_select_all(
    'hints',
    array(
        'id',
        'added',
        'body'
    ),
    array(
        'challenge' => $_GET['id']
    )
);

foreach ($hints as $hint) {
  echo '
  <tr>
      <td>',date_time($hint['added']),'</td>
      <td>',htmlspecialchars($hint['body']),'</td>
      <td><a href="edit_hint.php?id=',htmlspecialchars(short_description($hint['id'], 100)),'" class="btn btn-xs btn-warning">✎</a></td>
  </tr>
  ';
}
echo '
</tbody>
</table>
<div class="form-group">
  <label class="col-sm-2 control-label" for="Add a new hint"></label>
  <div class="col-sm-10" style="padding-left: 0px">
    <a href="new_hint.php?id=',htmlspecialchars($_GET['id']),'" class="btn btn-lg btn-warning">
      Add a new hint
    </a>
  </div>
</div>
';

echo '<br><br><br>';
section_small_dropdown ('Files');
echo '
  <table id="files" class="table table-striped table-hover">
    <thead>
      <tr>
        <th>Filename</th>
        <th>Size</th>
        <th>Added</th>
        <th>Manage</th>
      </tr>
    </thead>
    <tbody>
  ';

$files = db_select_all(
    'files',
    array(
        'id',
        'title',
        'size',
        'added',
        'download_key'
    ),
    array(
        'challenge' => $_GET['id']
    )
);

foreach ($files as $file) {
  echo '
      <tr>
          <td>
              <a href="../download.php?id=',htmlspecialchars($file['id']),'&amp;file_key=', htmlspecialchars($file['download_key']),'&amp;team_key=', get_user_download_key(),'">',htmlspecialchars($file['title']),'</a>
          </td>
          <td>',bytes_to_pretty_size($file['size']), '</td>
          <td>',date_time($file['added']),'</td>
          <td>';
            form_start(Config::get('MELLIVORA_CONFIG_SITE_ADMIN_RELPATH') . 'actions/edit_challenge', 'no-padding-or-margin');
            form_hidden('action', 'delete_file');
            form_hidden('id', $file['id']);
            form_hidden('challenge_id', $_GET['id']);
            form_button_submit_small ('Delete', 'btn-danger');
            form_end();
          echo '
          </td>
      </tr>
  ';
}

echo '
      </tbody>
   </table>
';

form_start(Config::get('MELLIVORA_CONFIG_SITE_ADMIN_RELPATH') . 'actions/edit_challenge','','multipart/form-data');
form_file('file');
echo '<br>';
form_hidden('action', 'upload_file');
form_hidden('id', $_GET['id']);
form_button_submit('Upload file');
echo '(Max file size: ',bytes_to_pretty_size(max_file_upload_size()), ')';
form_end();

section_subhead('Delete challenge: ' . $challenge['title']);
form_start(Config::get('MELLIVORA_CONFIG_SITE_ADMIN_RELPATH') . 'actions/edit_challenge');
form_input_checkbox('Delete confirmation', false, 'red');
form_hidden('action', 'delete');
form_hidden('id', $_GET['id']);
message_inline_red('Warning! This will also delete all submissions, all hints and all files associated with challenge!');
form_button_submit('Delete challenge', 'danger');
form_end();

foot();
